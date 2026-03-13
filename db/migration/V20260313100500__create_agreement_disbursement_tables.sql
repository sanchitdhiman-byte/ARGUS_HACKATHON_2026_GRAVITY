-- V20260313100500__create_agreement_disbursement_tables.sql
-- Creates agreement and disbursement tables: grant_agreements, disbursement_tranches, grantee_bank_details

CREATE TABLE IF NOT EXISTS grant_agreements (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id  UUID NOT NULL REFERENCES applications(id),
    agreement_number VARCHAR(30) NOT NULL UNIQUE,
    status          agreement_status NOT NULL DEFAULT 'DRAFT',
    awarded_amount  DECIMAL(15, 2) NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    terms_document_id UUID REFERENCES document_vault(id),
    signed_document_id UUID REFERENCES document_vault(id),
    signed_by_grantee_at TIMESTAMP WITH TIME ZONE,
    signed_by_authority_at TIMESTAMP WITH TIME ZONE,
    special_conditions TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS disbursement_tranches (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agreement_id    UUID NOT NULL REFERENCES grant_agreements(id) ON DELETE CASCADE,
    tranche_number  INTEGER NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    scheduled_date  DATE NOT NULL,
    status          tranche_status NOT NULL DEFAULT 'SCHEDULED',
    conditions      TEXT,
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMP WITH TIME ZONE,
    disbursed_at    TIMESTAMP WITH TIME ZONE,
    payment_reference VARCHAR(50),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(agreement_id, tranche_number)
);

CREATE TABLE IF NOT EXISTS grantee_bank_details (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID NOT NULL REFERENCES organisations(id),
    account_name    VARCHAR(255) NOT NULL,
    sort_code       VARCHAR(8) NOT NULL,
    account_number  VARCHAR(20) NOT NULL,
    bank_name       VARCHAR(100),
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by     UUID REFERENCES users(id),
    verified_at     TIMESTAMP WITH TIME ZONE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_grant_agreements_application ON grant_agreements(application_id);
CREATE INDEX idx_grant_agreements_status ON grant_agreements(status);
CREATE INDEX idx_disbursement_tranches_agreement ON disbursement_tranches(agreement_id);
CREATE INDEX idx_disbursement_tranches_status ON disbursement_tranches(status);
CREATE INDEX idx_disbursement_tranches_scheduled ON disbursement_tranches(scheduled_date);
CREATE INDEX idx_grantee_bank_details_organisation ON grantee_bank_details(organisation_id);
