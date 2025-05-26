// Database model types for GEO Scanner v2.0

export type PlanType = 'free' | 'starter' | 'pro';
export type TransactionType = 'purchase' | 'scan' | 'refund' | 'bonus';
export type ScanTier = 'anonymous' | 'starter' | 'pro';

// User model
export interface User {
  id: number;
  firebase_uid: string;
  email: string;
  plan_type: PlanType;
  credits_remaining: number;
  stripe_customer_id?: string;
  created_at: Date;
  updated_at: Date;
}

// User creation input (for new registrations)
export interface CreateUserInput {
  firebase_uid: string;
  email: string;
  plan_type?: PlanType;
  credits_remaining?: number;
  stripe_customer_id?: string;
}

// User update input
export interface UpdateUserInput {
  email?: string;
  plan_type?: PlanType;
  credits_remaining?: number;
  stripe_customer_id?: string;
}

// Credit transaction model
export interface CreditTransaction {
  id: number;
  user_id: number;
  transaction_type: TransactionType;
  credits_change: number;
  stripe_payment_id?: string;
  description?: string;
  created_at: Date;
}

// Credit transaction creation input
export interface CreateCreditTransactionInput {
  user_id: number;
  transaction_type: TransactionType;
  credits_change: number;
  stripe_payment_id?: string;
  description?: string;
}

// Module scores structure
export interface ModuleScores {
  performance: number;
  accessibility: number;
  best_practices: number;
  seo: number;
  pwa: number;
  security: number;
  mobile_friendly: number;
  core_web_vitals: number;
}

// AI suggestions structure
export interface AISuggestions {
  priority_fixes: Array<{
    module: string;
    issue: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'easy' | 'medium' | 'hard';
    code_snippet?: string;
    implementation_steps: string[];
  }>;
  roadmap: Array<{
    phase: number;
    title: string;
    description: string;
    estimated_impact: number;
    tasks: string[];
  }>;
}

// Benchmark data structure
export interface BenchmarkData {
  industry_average: ModuleScores;
  percentile_rank: number;
  competitor_comparison: Array<{
    competitor_url: string;
    overall_score: number;
    strengths: string[];
    weaknesses: string[];
  }>;
}

// Scan result model
export interface ScanResult {
  id: string; // UUID
  user_id?: number;
  url: string;
  overall_score?: number;
  module_scores?: ModuleScores;
  ai_suggestions?: AISuggestions;
  benchmark_data?: BenchmarkData;
  scan_tier: ScanTier;
  created_at: Date;
  expires_at?: Date;
}

// Scan result creation input
export interface CreateScanResultInput {
  user_id?: number;
  url: string;
  overall_score?: number;
  module_scores?: ModuleScores;
  ai_suggestions?: AISuggestions;
  benchmark_data?: BenchmarkData;
  scan_tier: ScanTier;
  expires_at?: Date;
}

// Email lead model
export interface EmailLead {
  id: number;
  email: string;
  scan_id?: string;
  converted_to_paid: boolean;
  created_at: Date;
  last_contacted?: Date;
}

// Email lead creation input
export interface CreateEmailLeadInput {
  email: string;
  scan_id?: string;
  converted_to_paid?: boolean;
  last_contacted?: Date;
}

// Database query result types
export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

// Credit operation result
export interface CreditOperationResult {
  success: boolean;
  user: User;
  transaction: CreditTransaction;
  remaining_credits: number;
}

// Tier limits and features
export interface TierLimits {
  credits_per_purchase: number;
  scan_history_days: number;
  features: {
    pdf_reports: boolean;
    ai_suggestions: boolean;
    benchmarking: boolean;
    monitoring: boolean;
    code_snippets: boolean;
  };
}

export const TIER_LIMITS: Record<PlanType, TierLimits> = {
  free: {
    credits_per_purchase: 1,
    scan_history_days: 0,
    features: {
      pdf_reports: false,
      ai_suggestions: false,
      benchmarking: false,
      monitoring: false,
      code_snippets: false,
    },
  },
  starter: {
    credits_per_purchase: 2,
    scan_history_days: 30,
    features: {
      pdf_reports: true,
      ai_suggestions: false,
      benchmarking: false,
      monitoring: false,
      code_snippets: false,
    },
  },
  pro: {
    credits_per_purchase: 5,
    scan_history_days: 90,
    features: {
      pdf_reports: true,
      ai_suggestions: true,
      benchmarking: true,
      monitoring: true,
      code_snippets: true,
    },
  },
};

// Database error types
export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class InsufficientCreditsError extends Error {
  constructor(required: number, available: number) {
    super(`Insufficient credits: required ${required}, available ${available}`);
    this.name = 'InsufficientCreditsError';
  }
}

export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundError';
  }
} 