-- V20260313100600__create_compliance_tables.sql
-- Creates compliance-related tables: compliance_reports, report_attachments, compliance_analyses,
-- report_reviews, expenditure_records

CREATE TABLE compliance_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id    UUID NOT NULL REFERENCES grant_agreements(id) ON DELETE CASCADE,
    report_type     report_type NOT NULL,
    status          report_status NOT NULL DEFAULT 'DRAFT',
    reporting_period_start DATE NOT NULL,
    reporting_period_end   DATE NOT NULL,
    due_date        DATE NOT NULL,
    submitted_at    TIMESTAMP WITH TIME ZONE,
    narrative       TEXT,
    financial_summary JSONB,
    outcomes_data   JSONB,
    submitted_by    UUID REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE report_attachments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id       UUID NOT NULL REFERENCES compliance_reports(id) ON DELETE CASCADE,
    document_id     UUID NOT NULL REFERENCES document_vault(id),
    attachment_type VARCHAR(100),
    description     TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE compliance_analyses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id       UUID NOT NULL REFERENCES compliance_reports(id) ON DELETE CASCADE,
    model_version   VARCHAR(50),
    compliance_score DECIMAL(5, 2),
    summary         TEXT,
    findings        JSONB,
    risk_flags      JSONB,
    recommendations JSONB,
    processing_time INTEGER,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE report_reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id       UUID NOT NULL REFERENCES compliance_reports(id) ON DELETE CASCADE,
    reviewer_id     UUID NOT NULL REFERENCES users(id),
    status          report_status NOT NULL DEFAULT 'UNDER_REVIEW',
    comments        TEXT,
    action_items    JSONB,
    reviewed_at     TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE expenditure_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id       UUID NOT NULL REFERENCES compliance_reports(id) ON DELETE CASCADE,
    category        VARCHAR(100) NOT NULL,
    description     TEXT NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    date_incurred   DATE NOT NULL,
    receipt_document_id UUID REFERENCES document_vault(id),
    is_eligible     BOOLEAN DEFAULT TRUE,
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_compliance_reports_agreement ON compliance_reports(agreement_id);
CREATE INDEX idx_compliance_reports_status ON compliance_reports(status);
CREATE INDEX idx_compliance_reports_due_date ON compliance_reports(due_date);
CREATE INDEX idx_compliance_reports_type ON compliance_reports(report_type);
CREATE INDEX idx_report_attachments_report ON report_attachments(report_id);
CREATE INDEX idx_compliance_analyses_report ON compliance_analyses(report_id);
CREATE INDEX idx_report_reviews_report ON report_reviews(report_id);
CREATE INDEX idx_report_reviews_reviewer ON report_reviews(reviewer_id);
CREATE INDEX idx_expenditure_records_report ON expenditure_records(report_id);
