import { pool, query } from '../db';
import fs from 'fs';
import path from 'path';

// Migration tracking table
const MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) UNIQUE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
`;

export interface Migration {
  filename: string;
  sql: string;
}

/**
 * Get all migration files from the migrations directory
 */
export function getMigrationFiles(): Migration[] {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found');
    return [];
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure migrations run in order

  return files.map(filename => ({
    filename,
    sql: fs.readFileSync(path.join(migrationsDir, filename), 'utf8')
  }));
}

/**
 * Get list of already executed migrations
 */
export async function getExecutedMigrations(): Promise<string[]> {
  try {
    const result = await query('SELECT filename FROM migrations ORDER BY executed_at');
    return result.rows.map(row => row.filename);
  } catch (error) {
    // If migrations table doesn't exist, return empty array
    return [];
  }
}

/**
 * Execute a single migration
 */
export async function executeMigration(migration: Migration): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Execute the migration SQL
    await client.query(migration.sql);
    
    // Record that this migration was executed
    await client.query(
      'INSERT INTO migrations (filename) VALUES ($1)',
      [migration.filename]
    );
    
    await client.query('COMMIT');
    console.log(`✅ Migration ${migration.filename} executed successfully`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Migration ${migration.filename} failed:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<void> {
  console.log('🚀 Starting database migrations...');
  
  try {
    // Ensure migrations table exists
    await query(MIGRATIONS_TABLE);
    
    // Get all migration files and executed migrations
    const allMigrations = getMigrationFiles();
    const executedMigrations = await getExecutedMigrations();
    
    // Filter out already executed migrations
    const pendingMigrations = allMigrations.filter(
      migration => !executedMigrations.includes(migration.filename)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }
    
    console.log(`📋 Found ${pendingMigrations.length} pending migrations:`);
    pendingMigrations.forEach(m => console.log(`   - ${m.filename}`));
    
    // Execute each pending migration
    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    throw error;
  }
}

/**
 * Reset database (for development only)
 */
export async function resetDatabase(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Database reset is not allowed in production');
  }
  
  console.log('🔄 Resetting database...');
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Drop all tables in reverse dependency order
    await client.query('DROP TABLE IF EXISTS email_leads CASCADE');
    await client.query('DROP TABLE IF EXISTS scan_results CASCADE');
    await client.query('DROP TABLE IF EXISTS credit_transactions CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TABLE IF EXISTS migrations CASCADE');
    
    // Drop custom types
    await client.query('DROP TYPE IF EXISTS plan_type CASCADE');
    await client.query('DROP TYPE IF EXISTS transaction_type CASCADE');
    await client.query('DROP TYPE IF EXISTS scan_tier CASCADE');
    
    await client.query('COMMIT');
    console.log('✅ Database reset completed');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database reset failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'up':
      runMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'reset':
      resetDatabase()
        .then(() => runMigrations())
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    default:
      console.log('Usage:');
      console.log('  npm run db:migrate     - Run pending migrations');
      console.log('  npm run db:reset       - Reset and re-run all migrations');
      process.exit(1);
  }
} 