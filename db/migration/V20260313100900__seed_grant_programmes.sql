-- V20260313100900__seed_grant_programmes.sql
-- Seeds 3 grant programmes: Community Development Grant (CDG), Enterprise Innovation Grant (EIG),
-- Environmental & Climate Action Grant (ECAG), with form fields for each

-- Community Development Grant (CDG)
INSERT INTO grant_programmes (id, name, description, status, total_budget, min_award, max_award, open_date, close_date, assessment_deadline)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Community Development Grant',
    'Funding to support local community projects that improve social cohesion, provide essential services, or enhance community infrastructure. Open to registered non-profits and community groups.',
    'OPEN',
    5000000.00,
    10000.00,
    250000.00,
    '2026-01-01T00:00:00Z',
    '2026-06-30T23:59:59Z',
    '2026-08-31T23:59:59Z'
);

-- Enterprise Innovation Grant (EIG)
INSERT INTO grant_programmes (id, name, description, status, total_budget, min_award, max_award, open_date, close_date, assessment_deadline)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'Enterprise Innovation Grant',
    'Supporting social enterprises and innovative organisations in developing scalable solutions to societal challenges. Focus on technology-enabled approaches to social impact.',
    'OPEN',
    3000000.00,
    25000.00,
    500000.00,
    '2026-02-01T00:00:00Z',
    '2026-07-31T23:59:59Z',
    '2026-09-30T23:59:59Z'
);

-- Environmental & Climate Action Grant (ECAG)
INSERT INTO grant_programmes (id, name, description, status, total_budget, min_award, max_award, open_date, close_date, assessment_deadline)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'Environmental & Climate Action Grant',
    'Grants for projects addressing climate change, biodiversity loss, and environmental sustainability at the local and regional level. Emphasis on measurable environmental outcomes.',
    'OPEN',
    4000000.00,
    15000.00,
    350000.00,
    '2026-03-01T00:00:00Z',
    '2026-08-31T23:59:59Z',
    '2026-10-31T23:59:59Z'
);

-- ========================================
-- Form Fields for Community Development Grant (CDG)
-- ========================================

-- Organisation Details section
INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000001', 'org_name', 'Organisation Name', 'TEXT', 'Organisation Details', TRUE, 1, 255, 'Legal name of your organisation'),
('a0000000-0000-0000-0000-000000000001', 'org_registration', 'Registration Number', 'TEXT', 'Organisation Details', TRUE, 2, 50, 'Charity Commission or Companies House registration number'),
('a0000000-0000-0000-0000-000000000001', 'org_type', 'Organisation Type', 'SELECT', 'Organisation Details', TRUE, 3, NULL, 'Select the type that best describes your organisation'),
('a0000000-0000-0000-0000-000000000001', 'org_address', 'Registered Address', 'TEXTAREA', 'Organisation Details', TRUE, 4, 500, NULL),
('a0000000-0000-0000-0000-000000000001', 'org_website', 'Website', 'TEXT', 'Organisation Details', FALSE, 5, 255, NULL),
('a0000000-0000-0000-0000-000000000001', 'annual_turnover', 'Annual Turnover (GBP)', 'CURRENCY', 'Organisation Details', TRUE, 6, NULL, 'Most recent financial year');

-- Project Details section
INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000001', 'project_title', 'Project Title', 'TEXT', 'Project Details', TRUE, 10, 200, 'A concise title for your project'),
('a0000000-0000-0000-0000-000000000001', 'project_summary', 'Project Summary', 'TEXTAREA', 'Project Details', TRUE, 11, 500, 'Brief overview of your project (max 500 characters)'),
('a0000000-0000-0000-0000-000000000001', 'project_description', 'Full Project Description', 'RICH_TEXT', 'Project Details', TRUE, 12, 5000, 'Detailed description of your project, its objectives, and planned activities'),
('a0000000-0000-0000-0000-000000000001', 'target_beneficiaries', 'Target Beneficiaries', 'TEXTAREA', 'Project Details', TRUE, 13, 2000, 'Who will benefit from this project and how?'),
('a0000000-0000-0000-0000-000000000001', 'community_need', 'Community Need', 'RICH_TEXT', 'Project Details', TRUE, 14, 3000, 'What community need does this project address? Include evidence.'),
('a0000000-0000-0000-0000-000000000001', 'project_location', 'Project Location', 'TEXT', 'Project Details', TRUE, 15, 255, 'Primary location(s) where the project will be delivered'),
('a0000000-0000-0000-0000-000000000001', 'start_date', 'Proposed Start Date', 'DATE', 'Project Details', TRUE, 16, NULL, NULL),
('a0000000-0000-0000-0000-000000000001', 'end_date', 'Proposed End Date', 'DATE', 'Project Details', TRUE, 17, NULL, NULL);

-- Funding section
INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000001', 'amount_requested', 'Amount Requested (GBP)', 'CURRENCY', 'Funding', TRUE, 20, NULL, 'Total grant amount requested'),
('a0000000-0000-0000-0000-000000000001', 'total_project_cost', 'Total Project Cost (GBP)', 'CURRENCY', 'Funding', TRUE, 21, NULL, 'Total cost of the project including other funding sources'),
('a0000000-0000-0000-0000-000000000001', 'budget_breakdown', 'Budget Breakdown', 'RICH_TEXT', 'Funding', TRUE, 22, 5000, 'Detailed breakdown of how the grant will be spent'),
('a0000000-0000-0000-0000-000000000001', 'other_funding', 'Other Funding Sources', 'TEXTAREA', 'Funding', FALSE, 23, 2000, 'Details of any other funding secured or applied for');

-- Impact & Outcomes section
INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000001', 'expected_outcomes', 'Expected Outcomes', 'RICH_TEXT', 'Impact & Outcomes', TRUE, 30, 3000, 'What outcomes do you expect to achieve?'),
('a0000000-0000-0000-0000-000000000001', 'measurement_plan', 'Measurement Plan', 'TEXTAREA', 'Impact & Outcomes', TRUE, 31, 2000, 'How will you measure and report on these outcomes?'),
('a0000000-0000-0000-0000-000000000001', 'sustainability_plan', 'Sustainability Plan', 'TEXTAREA', 'Impact & Outcomes', TRUE, 32, 2000, 'How will the project benefits be sustained beyond the grant period?');

-- ========================================
-- Form Fields for Enterprise Innovation Grant (EIG)
-- ========================================

INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000002', 'org_name', 'Organisation Name', 'TEXT', 'Organisation Details', TRUE, 1, 255, NULL),
('a0000000-0000-0000-0000-000000000002', 'org_registration', 'Registration Number', 'TEXT', 'Organisation Details', TRUE, 2, 50, NULL),
('a0000000-0000-0000-0000-000000000002', 'org_type', 'Organisation Type', 'SELECT', 'Organisation Details', TRUE, 3, NULL, NULL),
('a0000000-0000-0000-0000-000000000002', 'years_operating', 'Years in Operation', 'NUMBER', 'Organisation Details', TRUE, 4, NULL, NULL),
('a0000000-0000-0000-0000-000000000002', 'team_size', 'Team Size', 'NUMBER', 'Organisation Details', TRUE, 5, NULL, 'Number of full-time equivalent staff'),
('a0000000-0000-0000-0000-000000000002', 'annual_revenue', 'Annual Revenue (GBP)', 'CURRENCY', 'Organisation Details', TRUE, 6, NULL, NULL);

INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000002', 'innovation_title', 'Innovation Title', 'TEXT', 'Innovation Details', TRUE, 10, 200, NULL),
('a0000000-0000-0000-0000-000000000002', 'problem_statement', 'Problem Statement', 'RICH_TEXT', 'Innovation Details', TRUE, 11, 3000, 'What societal problem are you addressing?'),
('a0000000-0000-0000-0000-000000000002', 'proposed_solution', 'Proposed Solution', 'RICH_TEXT', 'Innovation Details', TRUE, 12, 5000, 'Describe your innovative solution'),
('a0000000-0000-0000-0000-000000000002', 'technology_stack', 'Technology/Approach', 'TEXTAREA', 'Innovation Details', TRUE, 13, 2000, 'What technology or methodology underpins your solution?'),
('a0000000-0000-0000-0000-000000000002', 'innovation_stage', 'Stage of Development', 'SELECT', 'Innovation Details', TRUE, 14, NULL, NULL),
('a0000000-0000-0000-0000-000000000002', 'competitive_landscape', 'Competitive Landscape', 'TEXTAREA', 'Innovation Details', TRUE, 15, 2000, 'Who else is working in this space?'),
('a0000000-0000-0000-0000-000000000002', 'unique_value', 'Unique Value Proposition', 'TEXTAREA', 'Innovation Details', TRUE, 16, 1000, NULL);

INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000002', 'amount_requested', 'Amount Requested (GBP)', 'CURRENCY', 'Funding & Scaling', TRUE, 20, NULL, NULL),
('a0000000-0000-0000-0000-000000000002', 'scaling_plan', 'Scaling Plan', 'RICH_TEXT', 'Funding & Scaling', TRUE, 21, 3000, 'How do you plan to scale the solution?'),
('a0000000-0000-0000-0000-000000000002', 'revenue_model', 'Revenue/Sustainability Model', 'TEXTAREA', 'Funding & Scaling', TRUE, 22, 2000, NULL),
('a0000000-0000-0000-0000-000000000002', 'impact_metrics', 'Impact Metrics', 'RICH_TEXT', 'Funding & Scaling', TRUE, 23, 3000, 'How will you measure social impact?'),
('a0000000-0000-0000-0000-000000000002', 'milestones', 'Key Milestones', 'RICH_TEXT', 'Funding & Scaling', TRUE, 24, 3000, '12-month milestone plan');

-- ========================================
-- Form Fields for Environmental & Climate Action Grant (ECAG)
-- ========================================

INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000003', 'org_name', 'Organisation Name', 'TEXT', 'Organisation Details', TRUE, 1, 255, NULL),
('a0000000-0000-0000-0000-000000000003', 'org_registration', 'Registration Number', 'TEXT', 'Organisation Details', TRUE, 2, 50, NULL),
('a0000000-0000-0000-0000-000000000003', 'org_type', 'Organisation Type', 'SELECT', 'Organisation Details', TRUE, 3, NULL, NULL),
('a0000000-0000-0000-0000-000000000003', 'environmental_track_record', 'Environmental Track Record', 'RICH_TEXT', 'Organisation Details', TRUE, 4, 3000, 'Previous environmental projects or initiatives');

INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000003', 'project_title', 'Project Title', 'TEXT', 'Environmental Project', TRUE, 10, 200, NULL),
('a0000000-0000-0000-0000-000000000003', 'environmental_challenge', 'Environmental Challenge', 'RICH_TEXT', 'Environmental Project', TRUE, 11, 3000, 'What environmental challenge does this project address?'),
('a0000000-0000-0000-0000-000000000003', 'project_approach', 'Project Approach', 'RICH_TEXT', 'Environmental Project', TRUE, 12, 5000, 'Describe your approach and methodology'),
('a0000000-0000-0000-0000-000000000003', 'geographic_scope', 'Geographic Scope', 'TEXT', 'Environmental Project', TRUE, 13, 255, NULL),
('a0000000-0000-0000-0000-000000000003', 'biodiversity_impact', 'Biodiversity Impact', 'TEXTAREA', 'Environmental Project', FALSE, 14, 2000, 'Expected impact on local biodiversity'),
('a0000000-0000-0000-0000-000000000003', 'carbon_reduction', 'Estimated Carbon Reduction', 'TEXTAREA', 'Environmental Project', FALSE, 15, 1000, 'Estimated tonnes of CO2 reduction if applicable'),
('a0000000-0000-0000-0000-000000000003', 'community_engagement', 'Community Engagement Plan', 'TEXTAREA', 'Environmental Project', TRUE, 16, 2000, 'How will you engage the local community?');

INSERT INTO programme_form_fields (programme_id, field_name, field_label, field_type, section, is_required, display_order, max_length, help_text)
VALUES
('a0000000-0000-0000-0000-000000000003', 'amount_requested', 'Amount Requested (GBP)', 'CURRENCY', 'Funding & Impact', TRUE, 20, NULL, NULL),
('a0000000-0000-0000-0000-000000000003', 'budget_breakdown', 'Budget Breakdown', 'RICH_TEXT', 'Funding & Impact', TRUE, 21, 5000, NULL),
('a0000000-0000-0000-0000-000000000003', 'environmental_outcomes', 'Environmental Outcomes', 'RICH_TEXT', 'Funding & Impact', TRUE, 22, 3000, 'Specific measurable environmental outcomes'),
('a0000000-0000-0000-0000-000000000003', 'monitoring_plan', 'Environmental Monitoring Plan', 'TEXTAREA', 'Funding & Impact', TRUE, 23, 2000, 'How will you monitor environmental outcomes?'),
('a0000000-0000-0000-0000-000000000003', 'long_term_sustainability', 'Long-term Environmental Sustainability', 'TEXTAREA', 'Funding & Impact', TRUE, 24, 2000, 'How will environmental benefits be maintained?');
