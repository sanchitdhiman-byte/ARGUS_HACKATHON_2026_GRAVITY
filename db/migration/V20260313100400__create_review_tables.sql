-- V20260313100400__create_review_tables.sql
-- Creates review-related tables: reviewer_assignments, ai_review_packages, ai_suggested_scores,
-- ai_risk_flags, review_scores, reviewer_annotations, award_decisions

CREATE TABLE IF NOT EXISTS reviewer_assignments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    reviewer_id     UUID NOT NULL REFERENCES users(id),
    assigned_by     UUID REFERENCES users(id),
    status          review_status NOT NULL DEFAULT 'ASSIGNED',
    due_date        TIMESTAMP WITH TIME ZONE,
    completed_at    TIMESTAMP WITH TIME ZONE,
    overall_score   DECIMAL(5, 2),
    recommendation  TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(application_id, reviewer_id)
);

CREATE TABLE IF NOT EXISTS ai_review_packages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    model_version   VARCHAR(50),
    executive_summary TEXT,
    strengths       JSONB,
    weaknesses      JSONB,
    overall_score   DECIMAL(5, 2),
    confidence      DECIMAL(5, 4),
    processing_time INTEGER, -- milliseconds
    raw_response    JSONB,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_suggested_scores (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ai_review_id        UUID NOT NULL REFERENCES ai_review_packages(id) ON DELETE CASCADE,
    rubric_criterion_id UUID NOT NULL REFERENCES programme_scoring_rubric(id),
    suggested_score     DECIMAL(5, 2) NOT NULL,
    justification       TEXT,
    evidence_references JSONB,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_risk_flags (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ai_review_id    UUID NOT NULL REFERENCES ai_review_packages(id) ON DELETE CASCADE,
    category        risk_category NOT NULL,
    severity        risk_level NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    evidence        TEXT,
    mitigation      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_scores (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id   UUID NOT NULL REFERENCES reviewer_assignments(id) ON DELETE CASCADE,
    rubric_id       UUID NOT NULL REFERENCES programme_scoring_rubric(id),
    score           DECIMAL(5, 2) NOT NULL,
    justification   TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(assignment_id, rubric_id)
);

CREATE TABLE IF NOT EXISTS reviewer_annotations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id   UUID NOT NULL REFERENCES reviewer_assignments(id) ON DELETE CASCADE,
    field_reference VARCHAR(255),
    annotation_text TEXT NOT NULL,
    is_internal     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS award_decisions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    decision        decision_type NOT NULL,
    decided_by      UUID NOT NULL REFERENCES users(id),
    approved_amount DECIMAL(15, 2),
    conditions      TEXT,
    rationale       TEXT NOT NULL,
    panel_date      DATE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reviewer_assignments_application ON reviewer_assignments(application_id);
CREATE INDEX idx_reviewer_assignments_reviewer ON reviewer_assignments(reviewer_id);
CREATE INDEX idx_reviewer_assignments_status ON reviewer_assignments(status);
CREATE INDEX idx_ai_review_packages_application ON ai_review_packages(application_id);
CREATE INDEX idx_ai_suggested_scores_review ON ai_suggested_scores(ai_review_id);
CREATE INDEX idx_ai_risk_flags_review ON ai_risk_flags(ai_review_id);
CREATE INDEX idx_ai_risk_flags_severity ON ai_risk_flags(severity);
CREATE INDEX idx_review_scores_assignment ON review_scores(assignment_id);
CREATE INDEX idx_reviewer_annotations_assignment ON reviewer_annotations(assignment_id);
CREATE INDEX idx_award_decisions_application ON award_decisions(application_id);
CREATE INDEX idx_award_decisions_decision ON award_decisions(decision);
