-- GrantFlow PostgreSQL Schema Initialisation
-- This runs once on first postgres container startup

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS applications;
CREATE SCHEMA IF NOT EXISTS screening;
CREATE SCHEMA IF NOT EXISTS review;
CREATE SCHEMA IF NOT EXISTS award;
CREATE SCHEMA IF NOT EXISTS reporting;
CREATE SCHEMA IF NOT EXISTS comms;
CREATE SCHEMA IF NOT EXISTS admin;

-- Grant all privileges to the default user on all schemas
DO $$
DECLARE
    schema_name text;
BEGIN
    FOR schema_name IN SELECT unnest(ARRAY['auth','applications','screening','review','award','reporting','comms','admin'])
    LOOP
        EXECUTE format('GRANT ALL PRIVILEGES ON SCHEMA %I TO CURRENT_USER', schema_name);
    END LOOP;
END $$;
