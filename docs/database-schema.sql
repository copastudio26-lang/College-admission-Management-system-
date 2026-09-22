-- PostgreSQL schema for the College Admission Management System
-- This file is a design baseline for the production-ready system.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TYPE user_role AS ENUM (
  'APPLICANT',
  'ADMISSION_OFFICER',
  'DOCUMENT_REVIEWER',
  'FINANCE_OFFICER',
  'ALLOTMENT_OFFICER',
  'INSTITUTION_ADMIN',
  'SUPER_ADMIN',
  'AUDITOR'
);

CREATE TYPE application_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'DOCUMENTS_REQUIRED',
  'ELIGIBLE',
  'INELIGIBLE',
  'ALLOTTED',
  'WAITLISTED',
  'ACCEPTED',
  'WITHDRAWN',
  'REJECTED'
);

CREATE TYPE document_status AS ENUM (
  'PENDING',
  'PROCESSING',
  'VERIFIED',
  'REJECTED',
  'EXPIRED'
);

CREATE TYPE payment_status AS ENUM (
  'INITIATED',
  'PENDING',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
  'PARTIALLY_REFUNDED'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_subject VARCHAR(255) UNIQUE NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  phone VARCHAR(30),
  full_name VARCHAR(200),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id),
  role user_role NOT NULL,
  institution_id UUID,
  PRIMARY KEY (user_id, role, institution_id)
);

CREATE TABLE admission_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL,
  name VARCHAR(150) NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  degree_level VARCHAR(50) NOT NULL,
  duration_years NUMERIC(3,1),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (institution_id, code)
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number VARCHAR(40) UNIQUE NOT NULL,
  applicant_id UUID NOT NULL REFERENCES users(id),
  admission_cycle_id UUID NOT NULL REFERENCES admission_cycles(id),
  program_id UUID NOT NULL REFERENCES programs(id),
  status application_status NOT NULL DEFAULT 'DRAFT',
  current_step SMALLINT NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (applicant_id, admission_cycle_id)
);

CREATE TABLE applicant_profiles (
  application_id UUID PRIMARY KEY REFERENCES applications(id),
  date_of_birth DATE NOT NULL,
  gender VARCHAR(40),
  nationality VARCHAR(100),
  category_code VARCHAR(50),
  disability_category VARCHAR(100),
  address JSONB NOT NULL,
  emergency_contact JSONB,
  consent_version VARCHAR(30) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE academic_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  institution_name VARCHAR(250) NOT NULL,
  qualification VARCHAR(150) NOT NULL,
  board_or_university VARCHAR(250),
  passing_year INTEGER,
  percentage NUMERIC(6,3),
  cgpa NUMERIC(5,3),
  subjects JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  document_type VARCHAR(80) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  checksum_sha256 CHAR(64),
  status document_status NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  decision document_status NOT NULL,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_cycle_id UUID NOT NULL REFERENCES admission_cycles(id),
  program_id UUID NOT NULL REFERENCES programs(id),
  fee_type VARCHAR(80) NOT NULL,
  amount_minor BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  due_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  provider VARCHAR(40) NOT NULL,
  provider_order_id VARCHAR(255) UNIQUE,
  amount_minor BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  status payment_status NOT NULL DEFAULT 'INITIATED',
  idempotency_key VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_order_id UUID NOT NULL REFERENCES payment_orders(id),
  provider_transaction_id VARCHAR(255) UNIQUE,
  event_type VARCHAR(100) NOT NULL,
  amount_minor BIGINT NOT NULL,
  status payment_status NOT NULL,
  provider_payload JSONB NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_order_id UUID NOT NULL REFERENCES payment_orders(id),
  receipt_number VARCHAR(80) UNIQUE NOT NULL,
  pdf_object_key TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reconciliation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(40) NOT NULL,
  settlement_date DATE NOT NULL,
  provider_transaction_id VARCHAR(255) NOT NULL,
  internal_transaction_id UUID REFERENCES payment_transactions(id),
  expected_amount_minor BIGINT,
  settled_amount_minor BIGINT,
  status VARCHAR(40) NOT NULL,
  discrepancy_reason TEXT,
  UNIQUE (provider, settlement_date, provider_transaction_id)
);

CREATE TABLE reservation_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  percentage NUMERIC(6,3) NOT NULL CHECK (percentage >= 0 AND percentage <= 100)
);

CREATE TABLE seat_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_cycle_id UUID NOT NULL REFERENCES admission_cycles(id),
  program_id UUID NOT NULL REFERENCES programs(id),
  campus VARCHAR(150),
  total_seats INTEGER NOT NULL CHECK (total_seats >= 0),
  version INTEGER NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ
);

CREATE TABLE seat_matrix_categories (
  seat_matrix_id UUID NOT NULL REFERENCES seat_matrices(id),
  category_id UUID NOT NULL REFERENCES reservation_categories(id),
  seat_count INTEGER NOT NULL CHECK (seat_count >= 0),
  allocated_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (seat_matrix_id, category_id)
);

CREATE TABLE merit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  rule_version VARCHAR(50) NOT NULL,
  score NUMERIC(12,5) NOT NULL,
  rank INTEGER,
  breakdown JSONB NOT NULL,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (application_id, rule_version)
);

CREATE TABLE allotments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  seat_matrix_id UUID NOT NULL REFERENCES seat_matrices(id),
  category_id UUID NOT NULL REFERENCES reservation_categories(id),
  round_number INTEGER NOT NULL,
  status VARCHAR(40) NOT NULL,
  allotment_number VARCHAR(80) UNIQUE NOT NULL,
  letter_object_key TEXT,
  allotted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE (application_id, round_number)
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  user_agent TEXT,
  correlation_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_cycle_status
  ON applications(admission_cycle_id, status);

CREATE INDEX idx_documents_review_queue
  ON documents(status, created_at);

CREATE INDEX idx_payment_orders_application
  ON payment_orders(application_id, status);

CREATE INDEX idx_audit_logs_entity
  ON audit_logs(entity_type, entity_id, created_at);
