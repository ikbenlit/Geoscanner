// Database exports for GEO Scanner v2.0

// Core database utilities
export { query, transaction, pool } from '../db';

// Migration utilities
export { runMigrations, resetDatabase, getMigrationFiles } from './migrate';

// Type definitions
export * from './types';

// Repository functions
export * as UserRepository from './repositories/users';
export * as ScanRepository from './repositories/scans';
export * as EmailLeadRepository from './repositories/email-leads';

// Convenience re-exports for common operations
export {
  // User operations
  findUserByFirebaseUid,
  createUser,
  updateUser,
  deductCredits,
  addCredits,
  hasCredits,
  syncUserFromFirebase,
} from './repositories/users';

export {
  // Scan operations
  createScanResult,
  findScanById,
  getUserScanHistory,
  createAnonymousScan,
  getScanStatistics,
} from './repositories/scans';

export {
  // Email lead operations
  createEmailLead,
  findEmailLeadByEmail,
  markEmailLeadAsConverted,
  getEmailLeadStatistics,
} from './repositories/email-leads'; 