import { query } from '../../db';
import {
  ScanResult,
  CreateScanResultInput,
  ScanTier,
  DatabaseError,
  TIER_LIMITS,
} from '../types';

/**
 * Create a new scan result
 */
export async function createScanResult(scanData: CreateScanResultInput): Promise<ScanResult> {
  try {
    const result = await query(
      `INSERT INTO scan_results (
        user_id, url, overall_score, module_scores, ai_suggestions, 
        benchmark_data, scan_tier, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        scanData.user_id || null,
        scanData.url,
        scanData.overall_score || null,
        scanData.module_scores ? JSON.stringify(scanData.module_scores) : null,
        scanData.ai_suggestions ? JSON.stringify(scanData.ai_suggestions) : null,
        scanData.benchmark_data ? JSON.stringify(scanData.benchmark_data) : null,
        scanData.scan_tier,
        scanData.expires_at || null,
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Failed to create scan result', error);
  }
}

/**
 * Find scan result by ID
 */
export async function findScanById(scanId: string): Promise<ScanResult | null> {
  try {
    const result = await query(
      'SELECT * FROM scan_results WHERE id = $1',
      [scanId]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new DatabaseError('Failed to find scan by ID', error);
  }
}

/**
 * Get user's scan history with tier-based filtering
 */
export async function getUserScanHistory(
  userId: number,
  planType: 'free' | 'starter' | 'pro',
  limit: number = 50
): Promise<ScanResult[]> {
  try {
    const tierLimits = TIER_LIMITS[planType];
    
    // Free tier has no history access
    if (tierLimits.scan_history_days === 0) {
      return [];
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - tierLimits.scan_history_days);
    
    const result = await query(
      `SELECT * FROM scan_results 
       WHERE user_id = $1 
       AND created_at >= $2
       ORDER BY created_at DESC 
       LIMIT $3`,
      [userId, cutoffDate.toISOString(), limit]
    );
    
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Failed to get user scan history', error);
  }
}

/**
 * Get recent scans for a user (last 10)
 */
export async function getRecentScans(userId: number): Promise<ScanResult[]> {
  try {
    const result = await query(
      `SELECT id, url, overall_score, scan_tier, created_at 
       FROM scan_results 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );
    
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Failed to get recent scans', error);
  }
}

/**
 * Update scan result with additional data (e.g., AI suggestions)
 */
export async function updateScanResult(
  scanId: string,
  updates: Partial<Pick<ScanResult, 'module_scores' | 'ai_suggestions' | 'benchmark_data'>>
): Promise<ScanResult> {
  try {
    const setParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updates.module_scores !== undefined) {
      setParts.push(`module_scores = $${paramIndex++}`);
      values.push(JSON.stringify(updates.module_scores));
    }
    if (updates.ai_suggestions !== undefined) {
      setParts.push(`ai_suggestions = $${paramIndex++}`);
      values.push(JSON.stringify(updates.ai_suggestions));
    }
    if (updates.benchmark_data !== undefined) {
      setParts.push(`benchmark_data = $${paramIndex++}`);
      values.push(JSON.stringify(updates.benchmark_data));
    }
    
    if (setParts.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(scanId);
    
    const result = await query(
      `UPDATE scan_results 
       SET ${setParts.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      throw new Error('Scan not found');
    }
    
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError('Failed to update scan result', error);
  }
}

/**
 * Delete expired scans (cleanup job)
 */
export async function deleteExpiredScans(): Promise<number> {
  try {
    const result = await query(
      'DELETE FROM scan_results WHERE expires_at IS NOT NULL AND expires_at < NOW()'
    );
    
    return result.rowCount || 0;
  } catch (error) {
    throw new DatabaseError('Failed to delete expired scans', error);
  }
}

/**
 * Get scan statistics for analytics
 */
export async function getScanStatistics(days: number = 30): Promise<{
  total_scans: number;
  scans_by_tier: Record<ScanTier, number>;
  average_score: number;
  unique_users: number;
}> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Total scans
    const totalResult = await query(
      'SELECT COUNT(*) as total FROM scan_results WHERE created_at >= $1',
      [cutoffDate.toISOString()]
    );
    
    // Scans by tier
    const tierResult = await query(
      `SELECT scan_tier, COUNT(*) as count 
       FROM scan_results 
       WHERE created_at >= $1 
       GROUP BY scan_tier`,
      [cutoffDate.toISOString()]
    );
    
    // Average score
    const avgResult = await query(
      `SELECT AVG(overall_score) as avg_score 
       FROM scan_results 
       WHERE created_at >= $1 AND overall_score IS NOT NULL`,
      [cutoffDate.toISOString()]
    );
    
    // Unique users
    const usersResult = await query(
      `SELECT COUNT(DISTINCT user_id) as unique_users 
       FROM scan_results 
       WHERE created_at >= $1 AND user_id IS NOT NULL`,
      [cutoffDate.toISOString()]
    );
    
    const scansByTier: Record<ScanTier, number> = {
      anonymous: 0,
      starter: 0,
      pro: 0,
    };
    
    tierResult.rows.forEach(row => {
      scansByTier[row.scan_tier as ScanTier] = parseInt(row.count);
    });
    
    return {
      total_scans: parseInt(totalResult.rows[0].total),
      scans_by_tier: scansByTier,
      average_score: parseFloat(avgResult.rows[0].avg_score) || 0,
      unique_users: parseInt(usersResult.rows[0].unique_users),
    };
  } catch (error) {
    throw new DatabaseError('Failed to get scan statistics', error);
  }
}

/**
 * Find scans by URL (for duplicate detection)
 */
export async function findScansByUrl(
  url: string,
  userId?: number,
  hours: number = 24
): Promise<ScanResult[]> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    
    let queryText = `
      SELECT * FROM scan_results 
      WHERE url = $1 
      AND created_at >= $2
    `;
    const params = [url, cutoffDate.toISOString()];
    
    if (userId) {
      queryText += ' AND user_id = $3';
      params.push(userId.toString());
    }
    
    queryText += ' ORDER BY created_at DESC';
    
    const result = await query(queryText, params);
    return result.rows;
  } catch (error) {
    throw new DatabaseError('Failed to find scans by URL', error);
  }
}

/**
 * Get scan count for user in time period (rate limiting)
 */
export async function getUserScanCount(
  userId: number,
  hours: number = 24
): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    
    const result = await query(
      `SELECT COUNT(*) as count 
       FROM scan_results 
       WHERE user_id = $1 
       AND created_at >= $2`,
      [userId, cutoffDate.toISOString()]
    );
    
    return parseInt(result.rows[0].count);
  } catch (error) {
    throw new DatabaseError('Failed to get user scan count', error);
  }
}

/**
 * Create anonymous scan with expiration
 */
export async function createAnonymousScan(
  url: string,
  overallScore?: number,
  moduleScores?: any
): Promise<ScanResult> {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Expire after 24 hours
  
  return createScanResult({
    url,
    overall_score: overallScore,
    module_scores: moduleScores,
    scan_tier: 'anonymous',
    expires_at: expiresAt,
  });
} 