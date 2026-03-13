-- V20260313101000__seed_documents_eligibility_rubric.sql
-- Seeds required documents, eligibility criteria, and scoring rubrics for all 3 programmes

-- ========================================
-- Required Documents
-- ========================================

-- CDG Required Documents
INSERT INTO programme_required_documents (programme_id, document_name, description, is_mandatory, display_order)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Governing Document', 'Constitution, articles of association, or trust deed', TRUE, 1),
('a0000000-0000-0000-0000-000000000001', 'Annual Accounts', 'Most recent audited or independently examined accounts', TRUE, 2),
('a0000000-0000-0000-0000-000000000001', 'Bank Statement', 'Recent bank statement (within last 3 months)', TRUE, 3),
('a0000000-0000-0000-0000-000000000001', 'Safeguarding Policy', 'Current safeguarding policy if working with vulnerable groups', FALSE, 4),
('a0000000-0000-0000-0000-000000000001', 'Project Budget', 'Detailed project budget spreadsheet', TRUE, 5),
('a0000000-0000-0000-0000-000000000001', 'Letters of Support', 'Supporting letters from community stakeholders', FALSE, 6);

-- EIG Required Documents
INSERT INTO programme_required_documents (programme_id, document_name, description, is_mandatory, display_order)
VALUES
('a0000000-0000-0000-0000-000000000002', 'Certificate of Incorporation', 'Companies House certificate or equivalent', TRUE, 1),
('a0000000-0000-0000-0000-000000000002', 'Financial Statements', 'Last 2 years of financial statements', TRUE, 2),
('a0000000-0000-0000-0000-000000000002', 'Business Plan', 'Current business plan including social impact strategy', TRUE, 3),
('a0000000-0000-0000-0000-000000000002', 'Technical Architecture', 'Technical documentation or architecture diagrams', FALSE, 4),
('a0000000-0000-0000-0000-000000000002', 'Impact Report', 'Most recent social impact report if available', FALSE, 5),
('a0000000-0000-0000-0000-000000000002', 'Pitch Deck', 'Presentation summarising the innovation', TRUE, 6),
('a0000000-0000-0000-0000-000000000002', 'Team CVs', 'CVs of key team members', TRUE, 7);

-- ECAG Required Documents
INSERT INTO programme_required_documents (programme_id, document_name, description, is_mandatory, display_order)
VALUES
('a0000000-0000-0000-0000-000000000003', 'Governing Document', 'Constitution or articles of association', TRUE, 1),
('a0000000-0000-0000-0000-000000000003', 'Annual Accounts', 'Most recent financial accounts', TRUE, 2),
('a0000000-0000-0000-0000-000000000003', 'Environmental Impact Assessment', 'Baseline environmental assessment for the project area', TRUE, 3),
('a0000000-0000-0000-0000-000000000003', 'Project Plan', 'Detailed project plan with timeline', TRUE, 4),
('a0000000-0000-0000-0000-000000000003', 'Land Permissions', 'Evidence of land access or permissions if applicable', FALSE, 5),
('a0000000-0000-0000-0000-000000000003', 'Environmental Policy', 'Organisation environmental policy', FALSE, 6),
('a0000000-0000-0000-0000-000000000003', 'Partnership Agreements', 'Agreements with project partners', FALSE, 7);

-- ========================================
-- Eligibility Criteria
-- ========================================

-- CDG Eligibility
INSERT INTO programme_eligibility_criteria (programme_id, criterion, description, is_mandatory, display_order)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Registered non-profit or community organisation', 'Must be a registered charity, CIC, CIO, or constituted community group', TRUE, 1),
('a0000000-0000-0000-0000-000000000001', 'Operating for at least 12 months', 'Organisation must have been operational for a minimum of 1 year', TRUE, 2),
('a0000000-0000-0000-0000-000000000001', 'Based in the United Kingdom', 'Organisation must be based in and delivering services in the UK', TRUE, 3),
('a0000000-0000-0000-0000-000000000001', 'Annual turnover under £1 million', 'Organisation annual turnover must not exceed £1,000,000', TRUE, 4),
('a0000000-0000-0000-0000-000000000001', 'No outstanding grant obligations', 'Must not have overdue reports or unresolved issues from previous grants', TRUE, 5),
('a0000000-0000-0000-0000-000000000001', 'Project benefits local community', 'Project must demonstrate clear benefit to a defined local community', TRUE, 6);

-- EIG Eligibility
INSERT INTO programme_eligibility_criteria (programme_id, criterion, description, is_mandatory, display_order)
VALUES
('a0000000-0000-0000-0000-000000000002', 'Registered social enterprise or CIC', 'Must be a registered social enterprise, CIC, or charity with trading arm', TRUE, 1),
('a0000000-0000-0000-0000-000000000002', 'Operating for at least 2 years', 'Organisation must have at least 2 years of operational history', TRUE, 2),
('a0000000-0000-0000-0000-000000000002', 'Based in the United Kingdom', 'Must be registered and operating in the UK', TRUE, 3),
('a0000000-0000-0000-0000-000000000002', 'Demonstrated social impact', 'Must show evidence of measurable social impact', TRUE, 4),
('a0000000-0000-0000-0000-000000000002', 'Innovation component', 'Project must include a genuine innovation or novel approach', TRUE, 5),
('a0000000-0000-0000-0000-000000000002', 'Scalability potential', 'Solution must have potential for scaling beyond initial implementation', TRUE, 6),
('a0000000-0000-0000-0000-000000000002', 'Matching funding of at least 20%', 'Applicant must contribute at least 20% of total project cost', FALSE, 7);

-- ECAG Eligibility
INSERT INTO programme_eligibility_criteria (programme_id, criterion, description, is_mandatory, display_order)
VALUES
('a0000000-0000-0000-0000-000000000003', 'Registered organisation', 'Must be a registered charity, CIC, community group, or local authority', TRUE, 1),
('a0000000-0000-0000-0000-000000000003', 'Operating for at least 12 months', 'Organisation must have been operational for a minimum of 1 year', TRUE, 2),
('a0000000-0000-0000-0000-000000000003', 'Based in the United Kingdom', 'Must be based in and delivering the project in the UK', TRUE, 3),
('a0000000-0000-0000-0000-000000000003', 'Clear environmental focus', 'Project must have a primary focus on environmental outcomes', TRUE, 4),
('a0000000-0000-0000-0000-000000000003', 'Measurable environmental outcomes', 'Must propose quantifiable environmental impact metrics', TRUE, 5),
('a0000000-0000-0000-0000-000000000003', 'Community engagement element', 'Project must include community engagement or education component', TRUE, 6),
('a0000000-0000-0000-0000-000000000003', 'Environmental policy in place', 'Organisation must have an environmental or sustainability policy', FALSE, 7);

-- ========================================
-- Scoring Rubrics
-- ========================================

-- CDG Scoring Rubric
INSERT INTO programme_scoring_rubric (programme_id, criterion_name, description, max_score, weight, guidance, display_order)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Community Need', 'Strength of evidence for community need', 10, 1.50, 'Score 8-10: Compelling evidence with data. 5-7: Good evidence. 3-4: Some evidence. 1-2: Weak evidence.', 1),
('a0000000-0000-0000-0000-000000000001', 'Project Design', 'Quality and feasibility of project design', 10, 1.25, 'Consider clarity of objectives, methodology, timeline, and risk management.', 2),
('a0000000-0000-0000-0000-000000000001', 'Impact & Outcomes', 'Potential for meaningful community impact', 10, 1.50, 'Assess scope of impact, number of beneficiaries, and depth of change.', 3),
('a0000000-0000-0000-0000-000000000001', 'Value for Money', 'Cost-effectiveness and budget appropriateness', 10, 1.00, 'Evaluate whether costs are reasonable and proportionate to expected outcomes.', 4),
('a0000000-0000-0000-0000-000000000001', 'Organisational Capacity', 'Ability to deliver the project successfully', 10, 1.00, 'Consider track record, team experience, governance, and partnerships.', 5),
('a0000000-0000-0000-0000-000000000001', 'Sustainability', 'Long-term sustainability of project benefits', 10, 0.75, 'Evaluate plans for maintaining benefits beyond the funding period.', 6);

-- EIG Scoring Rubric
INSERT INTO programme_scoring_rubric (programme_id, criterion_name, description, max_score, weight, guidance, display_order)
VALUES
('a0000000-0000-0000-0000-000000000002', 'Innovation Quality', 'Degree of genuine innovation', 10, 1.50, 'Score based on novelty, creativity, and differentiation from existing solutions.', 1),
('a0000000-0000-0000-0000-000000000002', 'Social Impact Potential', 'Potential for measurable social impact', 10, 1.50, 'Assess the breadth and depth of potential social change.', 2),
('a0000000-0000-0000-0000-000000000002', 'Scalability', 'Potential for scaling the solution', 10, 1.25, 'Consider market size, replicability, and growth strategy.', 3),
('a0000000-0000-0000-0000-000000000002', 'Technical Feasibility', 'Technical soundness and feasibility', 10, 1.00, 'Evaluate technical approach, architecture, and team capability.', 4),
('a0000000-0000-0000-0000-000000000002', 'Business Model', 'Sustainability of the business/revenue model', 10, 1.00, 'Assess revenue streams, cost structure, and path to sustainability.', 5),
('a0000000-0000-0000-0000-000000000002', 'Team & Governance', 'Quality of team and governance', 10, 0.75, 'Consider team experience, diversity, advisory board, and governance structures.', 6);

-- ECAG Scoring Rubric
INSERT INTO programme_scoring_rubric (programme_id, criterion_name, description, max_score, weight, guidance, display_order)
VALUES
('a0000000-0000-0000-0000-000000000003', 'Environmental Impact', 'Potential for meaningful environmental outcomes', 10, 2.00, 'Score based on scale, significance, and measurability of environmental benefits.', 1),
('a0000000-0000-0000-0000-000000000003', 'Scientific Basis', 'Strength of scientific evidence underpinning the approach', 10, 1.25, 'Evaluate evidence base, methodology, and alignment with best practices.', 2),
('a0000000-0000-0000-0000-000000000003', 'Project Feasibility', 'Feasibility and quality of project plan', 10, 1.00, 'Consider timeline, resources, risk management, and deliverability.', 3),
('a0000000-0000-0000-0000-000000000003', 'Community Engagement', 'Quality of community engagement plan', 10, 1.00, 'Assess plans for involving and educating the local community.', 4),
('a0000000-0000-0000-0000-000000000003', 'Long-term Sustainability', 'Sustainability of environmental benefits', 10, 1.25, 'Evaluate how environmental gains will be maintained over time.', 5),
('a0000000-0000-0000-0000-000000000003', 'Value for Money', 'Cost-effectiveness relative to environmental outcomes', 10, 0.75, 'Assess whether budget is proportionate to expected environmental impact.', 6),
('a0000000-0000-0000-0000-000000000003', 'Biodiversity Benefit', 'Contribution to biodiversity conservation', 10, 0.75, 'Score based on expected biodiversity outcomes, if applicable.', 7);
