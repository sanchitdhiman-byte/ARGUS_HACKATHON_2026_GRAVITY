-- V20260313100000__create_extensions_and_enums.sql
-- Creates required PostgreSQL extensions and all enum types

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types

CREATE TYPE user_role AS ENUM (
    'APPLICANT',
    'REVIEWER',
    'PROGRAMME_MANAGER',
    'FINANCE_OFFICER',
    'COMPLIANCE_OFFICER',
    'ADMIN'
);

CREATE TYPE organisation_type AS ENUM (
    'NON_PROFIT',
    'SOCIAL_ENTERPRISE',
    'COMMUNITY_GROUP',
    'LOCAL_AUTHORITY',
    'EDUCATIONAL_INSTITUTION',
    'HEALTHCARE_PROVIDER',
    'OTHER'
);

CREATE TYPE programme_status AS ENUM (
    'DRAFT',
    'OPEN',
    'CLOSED',
    'ARCHIVED'
);

CREATE TYPE field_type AS ENUM (
    'TEXT',
    'TEXTAREA',
    'NUMBER',
    'CURRENCY',
    'DATE',
    'SELECT',
    'MULTI_SELECT',
    'CHECKBOX',
    'FILE_UPLOAD',
    'RICH_TEXT'
);

CREATE TYPE application_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_SCREENING',
    'SCREENING_COMPLETE',
    'UNDER_REVIEW',
    'REVIEW_COMPLETE',
    'APPROVED',
    'REJECTED',
    'WITHDRAWN',
    'AWARDED'
);

CREATE TYPE document_status AS ENUM (
    'PENDING',
    'UPLOADED',
    'VERIFIED',
    'REJECTED'
);

CREATE TYPE screening_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'PASSED',
    'FAILED',
    'REFERRED'
);

CREATE TYPE check_type AS ENUM (
    'IDENTITY',
    'FINANCIAL',
    'REGULATORY',
    'SANCTIONS',
    'PEP',
    'ADVERSE_MEDIA',
    'DUPLICATE',
    'ELIGIBILITY'
);

CREATE TYPE check_result AS ENUM (
    'PASS',
    'FAIL',
    'WARNING',
    'PENDING',
    'ERROR'
);

CREATE TYPE review_status AS ENUM (
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'DECLINED'
);

CREATE TYPE risk_level AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE risk_category AS ENUM (
    'FINANCIAL',
    'OPERATIONAL',
    'COMPLIANCE',
    'REPUTATIONAL',
    'DELIVERY',
    'SAFEGUARDING'
);

CREATE TYPE decision_type AS ENUM (
    'APPROVE',
    'REJECT',
    'DEFER',
    'REQUEST_MORE_INFO'
);

CREATE TYPE agreement_status AS ENUM (
    'DRAFT',
    'SENT',
    'SIGNED',
    'ACTIVE',
    'COMPLETED',
    'TERMINATED'
);

CREATE TYPE tranche_status AS ENUM (
    'SCHEDULED',
    'PENDING_APPROVAL',
    'APPROVED',
    'DISBURSED',
    'HELD',
    'CANCELLED'
);

CREATE TYPE report_type AS ENUM (
    'PROGRESS',
    'FINANCIAL',
    'FINAL',
    'INTERIM',
    'AD_HOC'
);

CREATE TYPE report_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'OVERDUE'
);

CREATE TYPE notification_type AS ENUM (
    'EMAIL',
    'IN_APP',
    'SMS'
);

CREATE TYPE notification_status AS ENUM (
    'PENDING',
    'SENT',
    'DELIVERED',
    'FAILED',
    'READ'
);

CREATE TYPE message_direction AS ENUM (
    'INBOUND',
    'OUTBOUND'
);

CREATE TYPE audit_action AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'SUBMIT',
    'APPROVE',
    'REJECT',
    'ASSIGN',
    'UPLOAD',
    'DOWNLOAD',
    'SIGN',
    'DISBURSE'
);
