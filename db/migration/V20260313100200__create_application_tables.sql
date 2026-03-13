-- V20260313100200__create_application_tables.sql
-- Creates application-related tables: applications, document_vault, application_documents

CREATE TABLE IF NOT EXISTS applications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number    VARCHAR(20) NOT NULL UNIQUE,
    programme_id        UUID NOT NULL REFERENCES grant_programmes(id),
    applicant_id        UUID NOT NULL REFERENCES users(id),
    organisation_id     UUID REFERENCES organisations(id),
    status              application_status NOT NULL DEFAULT 'DRAFT',
    form_data           JSONB NOT NULL DEFAULT '{}',
    requested_amount    DECIMAL(15, 2),
    project_title       VARCHAR(500),
    project_summary     TEXT,
    project_start_date  DATE,
    project_end_date    DATE,
    submitted_at        TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_vault (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name       VARCHAR(255) NOT NULL,
    original_name   VARCHAR(255) NOT NULL,
    content_type    VARCHAR(100) NOT NULL,
    file_size       BIGINT NOT NULL,
    storage_path    VARCHAR(500) NOT NULL,
    checksum        VARCHAR(64),
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    is_encrypted    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS application_documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    required_doc_id     UUID REFERENCES programme_required_documents(id),
    document_id         UUID NOT NULL REFERENCES document_vault(id),
    status              document_status NOT NULL DEFAULT 'PENDING',
    reviewer_notes      TEXT,
    verified_by         UUID REFERENCES users(id),
    verified_at         TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applications_programme ON applications(programme_id);
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_applications_organisation ON applications(organisation_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_reference ON applications(reference_number);
CREATE INDEX idx_applications_submitted ON applications(submitted_at);
CREATE INDEX idx_document_vault_uploaded_by ON document_vault(uploaded_by);
CREATE INDEX idx_application_documents_application ON application_documents(application_id);
CREATE INDEX idx_application_documents_document ON application_documents(document_id);
