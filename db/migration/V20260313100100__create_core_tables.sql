-- V20260313100100__create_core_tables.sql
-- Creates core tables: users, organisations, grant_programmes, and related config tables

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            user_role NOT NULL DEFAULT 'APPLICANT',
    phone           VARCHAR(20),
    organisation_id UUID,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at   TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organisations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(255) NOT NULL,
    registration_number VARCHAR(50),
    organisation_type   organisation_type NOT NULL,
    address_line1       VARCHAR(255),
    address_line2       VARCHAR(255),
    city                VARCHAR(100),
    county              VARCHAR(100),
    postcode            VARCHAR(10),
    country             VARCHAR(100) DEFAULT 'United Kingdom',
    website             VARCHAR(255),
    phone               VARCHAR(20),
    primary_contact_id  UUID REFERENCES users(id),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD CONSTRAINT fk_users_organisation
    FOREIGN KEY (organisation_id) REFERENCES organisations(id);

CREATE TABLE IF NOT EXISTS grant_programmes (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    status              programme_status NOT NULL DEFAULT 'DRAFT',
    total_budget        DECIMAL(15, 2) NOT NULL,
    min_award           DECIMAL(15, 2),
    max_award           DECIMAL(15, 2),
    currency            VARCHAR(3) NOT NULL DEFAULT 'GBP',
    open_date           TIMESTAMP WITH TIME ZONE,
    close_date          TIMESTAMP WITH TIME ZONE,
    assessment_deadline TIMESTAMP WITH TIME ZONE,
    created_by          UUID REFERENCES users(id),
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programme_form_fields (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id    UUID NOT NULL REFERENCES grant_programmes(id) ON DELETE CASCADE,
    field_name      VARCHAR(100) NOT NULL,
    field_label     VARCHAR(255) NOT NULL,
    field_type      field_type NOT NULL,
    section         VARCHAR(100) NOT NULL DEFAULT 'General',
    is_required     BOOLEAN NOT NULL DEFAULT FALSE,
    display_order   INTEGER NOT NULL DEFAULT 0,
    max_length      INTEGER,
    min_value       DECIMAL(15, 2),
    max_value       DECIMAL(15, 2),
    options         JSONB,
    help_text       TEXT,
    validation_rule VARCHAR(500),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programme_required_documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id    UUID NOT NULL REFERENCES grant_programmes(id) ON DELETE CASCADE,
    document_name   VARCHAR(255) NOT NULL,
    description     TEXT,
    is_mandatory    BOOLEAN NOT NULL DEFAULT TRUE,
    max_file_size   INTEGER DEFAULT 10485760, -- 10MB
    allowed_types   TEXT[] DEFAULT ARRAY['application/pdf', 'image/jpeg', 'image/png'],
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programme_eligibility_criteria (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id    UUID NOT NULL REFERENCES grant_programmes(id) ON DELETE CASCADE,
    criterion       TEXT NOT NULL,
    description     TEXT,
    is_mandatory    BOOLEAN NOT NULL DEFAULT TRUE,
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programme_scoring_rubric (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id    UUID NOT NULL REFERENCES grant_programmes(id) ON DELETE CASCADE,
    criterion_name  VARCHAR(255) NOT NULL,
    description     TEXT,
    max_score       INTEGER NOT NULL DEFAULT 10,
    weight          DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    guidance        TEXT,
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programme_workflow_stages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id    UUID NOT NULL REFERENCES grant_programmes(id) ON DELETE CASCADE,
    stage_name      VARCHAR(100) NOT NULL,
    stage_order     INTEGER NOT NULL,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sla_days        INTEGER,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for core tables
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_organisation ON users(organisation_id);
CREATE INDEX idx_organisations_type ON organisations(organisation_type);
CREATE INDEX idx_grant_programmes_status ON grant_programmes(status);
CREATE INDEX idx_programme_form_fields_programme ON programme_form_fields(programme_id);
CREATE INDEX idx_programme_required_docs_programme ON programme_required_documents(programme_id);
CREATE INDEX idx_programme_eligibility_programme ON programme_eligibility_criteria(programme_id);
CREATE INDEX idx_programme_scoring_programme ON programme_scoring_rubric(programme_id);
CREATE INDEX idx_programme_workflow_programme ON programme_workflow_stages(programme_id);
