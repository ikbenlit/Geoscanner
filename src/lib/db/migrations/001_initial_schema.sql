-- GEO Scanner v2.0 - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Created: December 2024

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE plan_type AS ENUM ('free', 'starter', 'pro');
CREATE TYPE transaction_type AS ENUM ('purchase', 'scan', 'refund', 'bonus');
CREATE TYPE scan_tier AS ENUM ('anonymous', 'starter', 'pro');

-- Users table - Core user management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    plan_type plan_type DEFAULT 'free',
    credits_remaining INTEGER DEFAULT 1,
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit transactions - Audit trail for all credit operations
CREATE TABLE credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    credits_change INTEGER NOT NULL,
    stripe_payment_id VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scan results - Store all scan data
CREATE TABLE scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    url VARCHAR(2048) NOT NULL,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    module_scores JSONB,
    ai_suggestions JSONB,
    benchmark_data JSONB,
    scan_tier scan_tier NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Email leads - Capture emails from anonymous users
CREATE TABLE email_leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    scan_id UUID REFERENCES scan_results(id) ON DELETE SET NULL,
    converted_to_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contacted TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at);
CREATE INDEX idx_credit_transactions_stripe_payment ON credit_transactions(stripe_payment_id);

CREATE INDEX idx_scan_results_user_id ON scan_results(user_id);
CREATE INDEX idx_scan_results_created_at ON scan_results(created_at);
CREATE INDEX idx_scan_results_expires_at ON scan_results(expires_at);
CREATE INDEX idx_scan_results_url ON scan_results(url);
CREATE INDEX idx_scan_results_tier ON scan_results(scan_tier);

CREATE INDEX idx_email_leads_email ON email_leads(email);
CREATE INDEX idx_email_leads_scan_id ON email_leads(scan_id);
CREATE INDEX idx_email_leads_converted ON email_leads(converted_to_paid);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default data for testing
INSERT INTO users (firebase_uid, email, plan_type, credits_remaining) VALUES
    ('test-free-user', 'free@test.com', 'free', 1),
    ('test-starter-user', 'starter@test.com', 'starter', 2),
    ('test-pro-user', 'pro@test.com', 'pro', 5);

-- Insert sample credit transactions
INSERT INTO credit_transactions (user_id, transaction_type, credits_change, description) VALUES
    (2, 'purchase', 2, 'Starter package purchase'),
    (3, 'purchase', 5, 'Pro package purchase');

COMMENT ON TABLE users IS 'Core user accounts linked to Firebase Auth';
COMMENT ON TABLE credit_transactions IS 'Audit trail for all credit operations';
COMMENT ON TABLE scan_results IS 'Website scan results and analysis data';
COMMENT ON TABLE email_leads IS 'Email capture from anonymous users for conversion'; 