-- V20260313100300__create_screening_tables.sql
-- Creates screening-related tables: screening_reports, screening_checks

CREATE TABLE IF NOT EXISTS screening_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    status          screening_status NOT NULL DEFAULT 'PENDING',
    overall_risk    risk_level DEFAULT 'LOW',
    ai_confidence   DECIMAL(5, 4),
    summary         TEXT,
    started_at      TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    reviewed_by     UUID REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS screening_checks (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screening_report_id UUID NOT NULL REFERENCES screening_reports(id) ON DELETE CASCADE,
    check_type          check_type NOT NULL,
    result              check_result NOT NULL DEFAULT 'PENDING',
    details             JSONB,
    risk_level          risk_level DEFAULT 'LOW',
    source              VARCHAR(100),
    checked_at          TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_screening_reports_application ON screening_reports(application_id);
CREATE INDEX idx_screening_reports_status ON screening_reports(status);
CREATE INDEX idx_screening_checks_report ON screening_checks(screening_report_id);
CREATE INDEX idx_screening_checks_type ON screening_checks(check_type);
CREATE INDEX idx_screening_checks_result ON screening_checks(result);
