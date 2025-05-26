import { query, transaction } from '../../db';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  CreditTransaction,
  CreateCreditTransactionInput,
  CreditOperationResult,
  UserNotFoundError,
  InsufficientCreditsError,
  DatabaseError,
  PlanType,
} from '../types';

// Tijdelijke mock data voor development zonder database
const MOCK_MODE = process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL;
const mockUsers = new Map<string, User>();

/**
 * Find user by Firebase UID
 */
export async function findUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
  if (MOCK_MODE) {
    console.log('🔧 MOCK MODE: Finding user by Firebase UID:', firebaseUid);
    return mockUsers.get(firebaseUid) || null;
  }

  try {
    const result = await query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [firebaseUid]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError('Failed to find user by Firebase UID', error);
  }
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError('Failed to find user by email', error);
  }
}

/**
 * Find user by ID
 */
export async function findUserById(id: number): Promise<User | null> {
  try {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError('Failed to find user by ID', error);
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserInput): Promise<User> {
  try {
    const result = await query(
      `INSERT INTO users (firebase_uid, email, plan_type, credits_remaining, stripe_customer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userData.firebase_uid,
        userData.email,
        userData.plan_type || 'free',
        userData.credits_remaining || 1,
        userData.stripe_customer_id || null,
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Failed to create user', error);
  }
}

/**
 * Update user data
 */
export async function updateUser(firebaseUid: string, updates: UpdateUserInput): Promise<User> {
  try {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    // Build dynamic SET clause
    if (updates.email !== undefined) {
      setParts.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    if (updates.plan_type !== undefined) {
      setParts.push(`plan_type = $${paramIndex++}`);
      values.push(updates.plan_type);
    }
    if (updates.credits_remaining !== undefined) {
      setParts.push(`credits_remaining = $${paramIndex++}`);
      values.push(updates.credits_remaining);
    }
    if (updates.stripe_customer_id !== undefined) {
      setParts.push(`stripe_customer_id = $${paramIndex++}`);
      values.push(updates.stripe_customer_id);
    }
    
    if (setParts.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(firebaseUid);
    
    const result = await query(
      `UPDATE users SET ${setParts.join(', ')}, updated_at = NOW()
       WHERE firebase_uid = $${paramIndex}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      throw new UserNotFoundError(firebaseUid);
    }
    
    return result.rows[0];
  } catch (error) {
    if (error instanceof UserNotFoundError) throw error;
    throw new DatabaseError('Failed to update user', error);
  }
}

/**
 * Deduct credits from user (atomic operation)
 */
export async function deductCredits(
  firebaseUid: string,
  creditsToDeduct: number,
  description?: string
): Promise<CreditOperationResult> {
  return transaction(async (client) => {
    try {
      // Lock the user row and check credits
      const userResult = await client.query(
        'SELECT * FROM users WHERE firebase_uid = $1 FOR UPDATE',
        [firebaseUid]
      );
      
      if (userResult.rows.length === 0) {
        throw new UserNotFoundError(firebaseUid);
      }
      
      const user = userResult.rows[0];
      
      if (user.credits_remaining < creditsToDeduct) {
        throw new InsufficientCreditsError(creditsToDeduct, user.credits_remaining);
      }
      
      // Deduct credits
      const updatedUserResult = await client.query(
        `UPDATE users 
         SET credits_remaining = credits_remaining - $1, updated_at = NOW()
         WHERE firebase_uid = $2
         RETURNING *`,
        [creditsToDeduct, firebaseUid]
      );
      
      const updatedUser = updatedUserResult.rows[0];
      
      // Record transaction
      const transactionResult = await client.query(
        `INSERT INTO credit_transactions (user_id, transaction_type, credits_change, description)
         VALUES ($1, 'scan', $2, $3)
         RETURNING *`,
        [updatedUser.id, -creditsToDeduct, description || 'Scan credit deduction']
      );
      
      const creditTransaction = transactionResult.rows[0];
      
      return {
        success: true,
        user: updatedUser,
        transaction: creditTransaction,
        remaining_credits: updatedUser.credits_remaining,
      };
    } catch (error) {
      throw error;
    }
  });
}

/**
 * Add credits to user (for purchases)
 */
export async function addCredits(
  firebaseUid: string,
  creditsToAdd: number,
  stripePaymentId?: string,
  description?: string
): Promise<CreditOperationResult> {
  return transaction(async (client) => {
    try {
      // Get user
      const userResult = await client.query(
        'SELECT * FROM users WHERE firebase_uid = $1 FOR UPDATE',
        [firebaseUid]
      );
      
      if (userResult.rows.length === 0) {
        throw new UserNotFoundError(firebaseUid);
      }
      
      const user = userResult.rows[0];
      
      // Add credits
      const updatedUserResult = await client.query(
        `UPDATE users 
         SET credits_remaining = credits_remaining + $1, updated_at = NOW()
         WHERE firebase_uid = $2
         RETURNING *`,
        [creditsToAdd, firebaseUid]
      );
      
      const updatedUser = updatedUserResult.rows[0];
      
      // Record transaction
      const transactionResult = await client.query(
        `INSERT INTO credit_transactions (user_id, transaction_type, credits_change, stripe_payment_id, description)
         VALUES ($1, 'purchase', $2, $3, $4)
         RETURNING *`,
        [
          updatedUser.id,
          creditsToAdd,
          stripePaymentId,
          description || 'Credit purchase',
        ]
      );
      
      const creditTransaction = transactionResult.rows[0];
      
      return {
        success: true,
        user: updatedUser,
        transaction: creditTransaction,
        remaining_credits: updatedUser.credits_remaining,
      };
    } catch (error) {
      throw error;
    }
  });
}

/**
 * Upgrade user plan
 */
export async function upgradeUserPlan(
  firebaseUid: string,
  newPlan: PlanType,
  creditsToAdd: number,
  stripeCustomerId?: string
): Promise<User> {
  return transaction(async (client) => {
    try {
      // Update user plan and add credits
      const userResult = await client.query(
        `UPDATE users 
         SET plan_type = $1, 
             credits_remaining = credits_remaining + $2,
             stripe_customer_id = COALESCE($3, stripe_customer_id),
             updated_at = NOW()
         WHERE firebase_uid = $4
         RETURNING *`,
        [newPlan, creditsToAdd, stripeCustomerId, firebaseUid]
      );
      
      if (userResult.rows.length === 0) {
        throw new UserNotFoundError(firebaseUid);
      }
      
      const updatedUser = userResult.rows[0];
      
      // Record the plan upgrade transaction
      await client.query(
        `INSERT INTO credit_transactions (user_id, transaction_type, credits_change, description)
         VALUES ($1, 'purchase', $2, $3)`,
        [
          updatedUser.id,
          creditsToAdd,
          `Plan upgrade to ${newPlan}`,
        ]
      );
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  });
}

/**
 * Get user's credit transaction history
 */
export async function getUserCreditHistory(
  firebaseUid: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  try {
    const result = await query(
      `SELECT ct.* 
       FROM credit_transactions ct
       JOIN users u ON ct.user_id = u.id
       WHERE u.firebase_uid = $1
       ORDER BY ct.created_at DESC
       LIMIT $2`,
      [firebaseUid, limit]
    );
    
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Failed to get user credit history', error);
  }
}

/**
 * Check if user has sufficient credits
 */
export async function hasCredits(firebaseUid: string, requiredCredits: number = 1): Promise<boolean> {
  try {
    const result = await query(
      'SELECT credits_remaining FROM users WHERE firebase_uid = $1',
      [firebaseUid]
    );
    
    if (result.rows.length === 0) {
      return false;
    }
    
    return result.rows[0].credits_remaining >= requiredCredits;
  } catch (error) {
    throw new DatabaseError('Failed to check user credits', error);
  }
}

/**
 * Sync user from Firebase Auth (create or update)
 */
export async function syncUserFromFirebase(
  firebaseUid: string,
  email: string,
  displayName?: string
): Promise<User> {
  if (MOCK_MODE) {
    console.log('🔧 MOCK MODE: Syncing user from Firebase:', firebaseUid, email);
    
    let user = mockUsers.get(firebaseUid);
    
    if (user) {
      // Update existing mock user if email changed
      if (user.email !== email) {
        user.email = email;
        user.updated_at = new Date();
        mockUsers.set(firebaseUid, user);
      }
      return user;
    }
    
    // Create new mock user
    const mockUser: User = {
      id: Date.now(),
      firebase_uid: firebaseUid,
      email,
      plan_type: 'free',
      credits_remaining: 1,
      stripe_customer_id: undefined,
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockUsers.set(firebaseUid, mockUser);
    console.log('✅ Mock user created:', mockUser.id);
    return mockUser;
  }

  try {
    // Try to find existing user
    let user = await findUserByFirebaseUid(firebaseUid);
    
    if (user) {
      // Update existing user if email changed
      if (user.email !== email) {
        user = await updateUser(firebaseUid, { email });
      }
      return user;
    }
    
    // Create new user
    return await createUser({
      firebase_uid: firebaseUid,
      email,
      plan_type: 'free',
      credits_remaining: 1,
    });
  } catch (error) {
    throw new DatabaseError('Failed to sync user from Firebase', error);
  }
} 