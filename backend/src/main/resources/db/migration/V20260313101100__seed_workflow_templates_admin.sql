-- V20260313101100__seed_workflow_templates_admin.sql
-- Seeds workflow stages, document templates, and admin user

-- ========================================
-- Workflow Stages (common across all programmes)
-- ========================================

-- CDG Workflow Stages
INSERT INTO programme_workflow_stages (programme_id, stage_name, stage_order, description, sla_days)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Application Submission', 1, 'Applicant submits the completed application form and supporting documents', NULL),
('a0000000-0000-0000-0000-000000000001', 'Eligibility Screening', 2, 'Automated and manual checks for eligibility and compliance', 5),
('a0000000-0000-0000-0000-000000000001', 'Due Diligence', 3, 'Background checks and verification of applicant information', 10),
('a0000000-0000-0000-0000-000000000001', 'AI-Assisted Review', 4, 'AI analysis of application for initial scoring and risk assessment', 2),
('a0000000-0000-0000-0000-000000000001', 'Expert Review', 5, 'Independent expert reviewers assess and score the application', 15),
('a0000000-0000-0000-0000-000000000001', 'Panel Decision', 6, 'Grant panel reviews recommendations and makes award decisions', 5),
('a0000000-0000-0000-0000-000000000001', 'Grant Agreement', 7, 'Grant agreement preparation, negotiation and signing', 10),
('a0000000-0000-0000-0000-000000000001', 'Disbursement', 8, 'Grant funds disbursed according to agreed schedule', 5);

-- EIG Workflow Stages
INSERT INTO programme_workflow_stages (programme_id, stage_name, stage_order, description, sla_days)
VALUES
('a0000000-0000-0000-0000-000000000002', 'Application Submission', 1, 'Applicant submits the completed application', NULL),
('a0000000-0000-0000-0000-000000000002', 'Eligibility Screening', 2, 'Eligibility and compliance checks', 5),
('a0000000-0000-0000-0000-000000000002', 'Due Diligence', 3, 'Enhanced due diligence for innovation grants', 15),
('a0000000-0000-0000-0000-000000000002', 'AI-Assisted Review', 4, 'AI analysis and initial scoring', 2),
('a0000000-0000-0000-0000-000000000002', 'Technical Review', 5, 'Technical experts assess innovation feasibility', 20),
('a0000000-0000-0000-0000-000000000002', 'Impact Assessment', 6, 'Social impact assessment by specialist reviewers', 15),
('a0000000-0000-0000-0000-000000000002', 'Panel Decision', 7, 'Investment panel reviews and decides', 5),
('a0000000-0000-0000-0000-000000000002', 'Grant Agreement', 8, 'Agreement preparation and execution', 10),
('a0000000-0000-0000-0000-000000000002', 'Disbursement', 9, 'Milestone-based disbursement', 5);

-- ECAG Workflow Stages
INSERT INTO programme_workflow_stages (programme_id, stage_name, stage_order, description, sla_days)
VALUES
('a0000000-0000-0000-0000-000000000003', 'Application Submission', 1, 'Applicant submits the completed application', NULL),
('a0000000-0000-0000-0000-000000000003', 'Eligibility Screening', 2, 'Eligibility and environmental compliance checks', 5),
('a0000000-0000-0000-0000-000000000003', 'Due Diligence', 3, 'Background and environmental due diligence', 10),
('a0000000-0000-0000-0000-000000000003', 'AI-Assisted Review', 4, 'AI analysis of environmental proposals', 2),
('a0000000-0000-0000-0000-000000000003', 'Environmental Expert Review', 5, 'Specialist environmental reviewers assess the application', 20),
('a0000000-0000-0000-0000-000000000003', 'Panel Decision', 6, 'Environmental grant panel reviews and decides', 5),
('a0000000-0000-0000-0000-000000000003', 'Grant Agreement', 7, 'Agreement with environmental conditions', 10),
('a0000000-0000-0000-0000-000000000003', 'Disbursement', 8, 'Disbursement with environmental milestone triggers', 5);

-- ========================================
-- Document Templates
-- ========================================

INSERT INTO document_templates (name, description, template_type, content, variables, is_active)
VALUES
(
    'Application Acknowledgement',
    'Email sent when an application is successfully submitted',
    'EMAIL',
    'Dear {{applicant_name}},

Thank you for submitting your application (Reference: {{reference_number}}) to the {{programme_name}}.

We have received your application and it is now being processed. You will receive updates as your application progresses through our assessment stages.

Application Details:
- Reference: {{reference_number}}
- Programme: {{programme_name}}
- Project Title: {{project_title}}
- Amount Requested: £{{amount_requested}}
- Submitted: {{submitted_date}}

If you have any questions, please contact us quoting your reference number.

Kind regards,
The GrantFlow Team',
    '["applicant_name", "reference_number", "programme_name", "project_title", "amount_requested", "submitted_date"]',
    TRUE
),
(
    'Review Assignment Notification',
    'Email sent to reviewers when assigned a new application',
    'EMAIL',
    'Dear {{reviewer_name}},

You have been assigned a new application for review.

Application Details:
- Reference: {{reference_number}}
- Programme: {{programme_name}}
- Project Title: {{project_title}}
- Due Date: {{due_date}}

Please log in to GrantFlow to access the application and the AI-assisted review package.

Kind regards,
The GrantFlow Team',
    '["reviewer_name", "reference_number", "programme_name", "project_title", "due_date"]',
    TRUE
),
(
    'Award Notification',
    'Letter sent to successful applicants',
    'LETTER',
    'Dear {{applicant_name}},

RE: {{programme_name}} - Application {{reference_number}}

I am pleased to inform you that your application for funding under the {{programme_name}} has been successful.

Award Details:
- Grant Amount: £{{awarded_amount}}
- Project: {{project_title}}
- Grant Period: {{start_date}} to {{end_date}}

This award is subject to the terms and conditions set out in the Grant Agreement, which will be sent to you separately. Please review and sign the agreement within 30 days.

Key conditions:
{{special_conditions}}

Congratulations on your successful application. We look forward to working with you.

Yours sincerely,
Programme Manager
GrantFlow',
    '["applicant_name", "programme_name", "reference_number", "awarded_amount", "project_title", "start_date", "end_date", "special_conditions"]',
    TRUE
),
(
    'Rejection Notification',
    'Letter sent to unsuccessful applicants',
    'LETTER',
    'Dear {{applicant_name}},

RE: {{programme_name}} - Application {{reference_number}}

Thank you for your application to the {{programme_name}}. After careful consideration by our assessment panel, I regret to inform you that your application has not been successful on this occasion.

Feedback:
{{feedback}}

We received a high volume of quality applications and unfortunately were unable to fund all worthy projects. We encourage you to apply to future funding rounds.

If you would like to discuss this decision, please contact us quoting your reference number.

Yours sincerely,
Programme Manager
GrantFlow',
    '["applicant_name", "programme_name", "reference_number", "feedback"]',
    TRUE
),
(
    'Grant Agreement',
    'Standard grant agreement template',
    'AGREEMENT',
    'GRANT AGREEMENT

Agreement Number: {{agreement_number}}
Date: {{agreement_date}}

BETWEEN:
GrantFlow Authority ("the Funder")
AND
{{organisation_name}} ("the Grantee")

1. GRANT DETAILS
   Programme: {{programme_name}}
   Project: {{project_title}}
   Grant Amount: £{{awarded_amount}}
   Grant Period: {{start_date}} to {{end_date}}

2. PURPOSE
   The Grant is provided for the purposes described in the application (Reference: {{reference_number}}) and as summarised below:
   {{project_summary}}

3. PAYMENT SCHEDULE
   {{payment_schedule}}

4. REPORTING REQUIREMENTS
   The Grantee shall submit:
   - Quarterly progress reports
   - Six-monthly financial reports
   - A final report within 3 months of the project end date

5. SPECIAL CONDITIONS
   {{special_conditions}}

6. GENERAL CONDITIONS
   The Grantee agrees to comply with all terms and conditions as set out in the General Conditions of Grant (attached).

SIGNED:

For the Funder: ___________________  Date: ___________

For the Grantee: ___________________  Date: ___________',
    '["agreement_number", "agreement_date", "organisation_name", "programme_name", "project_title", "awarded_amount", "start_date", "end_date", "reference_number", "project_summary", "payment_schedule", "special_conditions"]',
    TRUE
),
(
    'Compliance Report Reminder',
    'Email reminder for upcoming compliance reports',
    'EMAIL',
    'Dear {{grantee_name}},

This is a reminder that your {{report_type}} report for the {{programme_name}} grant is due on {{due_date}}.

Grant Details:
- Agreement: {{agreement_number}}
- Project: {{project_title}}
- Reporting Period: {{period_start}} to {{period_end}}

Please log in to GrantFlow to submit your report. Late submissions may affect future disbursements.

Kind regards,
The GrantFlow Team',
    '["grantee_name", "report_type", "programme_name", "due_date", "agreement_number", "project_title", "period_start", "period_end"]',
    TRUE
);

-- ========================================
-- Admin User (password: Admin@123 - bcrypt hashed)
-- ========================================

INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, email_verified)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'admin@grantflow.gov.uk',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System',
    'Administrator',
    'ADMIN',
    TRUE,
    TRUE
);
