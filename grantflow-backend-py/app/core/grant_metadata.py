"""
Dynamic grant form metadata — defines per-programme field requirements,
rubric-specific narrative prompts, validation rules, and budget constraints.

Consumed by:
  - GET /programmes/metadata  (frontend form engine)
  - Backend validation on POST /applications
  - Chat bot for contextual prompts
"""

GRANT_METADATA = {
    "CDG": {
        "code": "CDG",
        "name": "Community Development Grant",
        "sections": [
            {
                "id": "organisation",
                "title": "Organisation Details",
                "icon": "business",
                "fields": [
                    {"key": "orgName", "label": "Organisation Legal Name", "type": "text", "required": True, "placeholder": "e.g. Rural Connect Foundation"},
                    {"key": "regNumber", "label": "Registration Number", "type": "text", "required": True, "placeholder": "e.g. MH/2019/0012345"},
                    {"key": "entityType", "label": "Entity Type", "type": "select", "required": True,
                     "options": ["NGO", "Trust", "Section 8 Company"]},
                    {"key": "establishedYear", "label": "Year of Establishment", "type": "number", "required": True, "placeholder": "e.g. 2018"},
                    {"key": "budget", "label": "Annual Operating Budget (INR)", "type": "number", "required": True, "placeholder": "e.g. 500000"},
                    {"key": "contactName", "label": "Contact Person Name", "type": "text", "required": True},
                    {"key": "contactRole", "label": "Contact Person Role", "type": "text", "required": True},
                    {"key": "email", "label": "Contact Email", "type": "email", "required": True},
                    {"key": "phone", "label": "Contact Phone", "type": "tel", "required": True},
                    {"key": "address", "label": "Registered Address", "type": "text", "required": True},
                    {"key": "city", "label": "City", "type": "text", "required": True},
                    {"key": "stateRegion", "label": "State / Region", "type": "text", "required": True},
                    {"key": "postalCode", "label": "Postal Code", "type": "text", "required": True},
                ],
            },
            {
                "id": "project",
                "title": "Project Details — Community Development",
                "icon": "groups",
                "description": "Describe the community infrastructure or social service project.",
                "fields": [
                    {"key": "projectTitle", "label": "Project Title", "type": "text", "required": True, "placeholder": "e.g. Clean Water Initiative for Bundelkhand"},
                    {"key": "projectLocation", "label": "Project Location (District, State)", "type": "text", "required": True, "placeholder": "e.g. Jhansi, Uttar Pradesh"},
                    {"key": "projectType", "label": "Project Type", "type": "select", "required": True,
                     "options": ["Infrastructure", "Social Services", "Healthcare", "Livelihood", "Water & Sanitation"]},
                    {"key": "communityNeed", "label": "Community Need Assessment", "type": "textarea", "required": True,
                     "placeholder": "Describe the specific community need this project addresses. Include data/evidence if available.",
                     "rubric_hint": "Scored under 'Community Need & Problem Clarity' (25%)"},
                    {"key": "problemStatement", "label": "Problem Statement", "type": "textarea", "required": True},
                    {"key": "proposedSolution", "label": "Proposed Solution & Project Design", "type": "textarea", "required": True,
                     "placeholder": "Detail your approach, implementation plan, and why it will work.",
                     "rubric_hint": "Scored under 'Project Design & Feasibility' (25%)"},
                    {"key": "targetBeneficiaries", "label": "Target Beneficiaries (Number)", "type": "number", "required": True, "placeholder": "e.g. 500"},
                    {"key": "demographics", "label": "Beneficiary Demographics", "type": "text", "required": True, "placeholder": "e.g. Women farmers, children aged 5-12"},
                    {"key": "impactOutcomes", "label": "Expected Impact & Measurable Outcomes", "type": "textarea", "required": True,
                     "placeholder": "What measurable change will this project create? Include KPIs.",
                     "rubric_hint": "Scored under 'Expected Impact & Outcomes' (20%)"},
                    {"key": "startDate", "label": "Project Start Date", "type": "date", "required": True},
                    {"key": "endDate", "label": "Project End Date", "type": "date", "required": True},
                    {"key": "keyActivities", "label": "Key Activities", "type": "textarea", "required": True},
                    {"key": "expectedOutcomes", "label": "Expected Outcomes", "type": "textarea", "required": True},
                ],
            },
            {
                "id": "budget",
                "title": "Budget Details",
                "icon": "payments",
                "fields": [
                    {"key": "personnel", "label": "Personnel Costs (INR)", "type": "number", "required": False, "placeholder": "0", "budget_line": True},
                    {"key": "equipment", "label": "Equipment & Materials (INR)", "type": "number", "required": False, "placeholder": "0", "budget_line": True},
                    {"key": "travel", "label": "Travel & Logistics (INR)", "type": "number", "required": False, "placeholder": "0", "budget_line": True},
                    {"key": "overheads", "label": "Overheads / Admin (INR)", "type": "number", "required": False, "placeholder": "0", "budget_line": True, "overhead": True},
                    {"key": "other", "label": "Other / Miscellaneous (INR)", "type": "number", "required": False, "placeholder": "0", "budget_line": True},
                    {"key": "totalRequested", "label": "Total Amount Requested (INR)", "type": "number", "required": True, "readonly": True, "auto_sum": True},
                    {"key": "justification", "label": "Budget Justification", "type": "textarea", "required": True,
                     "placeholder": "Explain why these costs are necessary.",
                     "rubric_hint": "Scored under 'Budget Realism' (10%)"},
                ],
                "rules": {
                    "overhead_cap_pct": 15,
                    "funding_min": 200000,
                    "funding_max": 2000000,
                    "budget_tolerance": 500,
                },
            },
            {
                "id": "experience",
                "title": "Experience & Declaration",
                "icon": "history_edu",
                "fields": [
                    {"key": "trackRecord", "label": "Organisation Track Record", "type": "textarea", "required": True,
                     "placeholder": "Describe your organisation's relevant past work, completed projects, and outcomes.",
                     "rubric_hint": "Scored under 'Organisation Track Record' (20%)"},
                    {"key": "hasPreviousGrants", "label": "Has Received Previous Grants?", "type": "checkbox", "required": False},
                    {"key": "priorProjects", "label": "Prior Projects (describe 1-2)", "type": "textarea", "required": False},
                    {"key": "priorFunder", "label": "Previous Funder", "type": "text", "required": False},
                    {"key": "priorAmount", "label": "Previous Grant Amount (INR)", "type": "number", "required": False},
                    {"key": "signatoryName", "label": "Authorised Signatory Name", "type": "text", "required": True},
                    {"key": "designation", "label": "Designation", "type": "text", "required": True},
                    {"key": "submissionDate", "label": "Submission Date", "type": "date", "required": True},
                    {"key": "declared", "label": "I declare all information provided is true and accurate", "type": "checkbox", "required": True},
                ],
            },
        ],
    },

    "EIG": {
        "code": "EIG",
        "name": "Education Innovation Grant",
        "sections": [
            {
                "id": "organisation",
                "title": "Organisation Details",
                "icon": "business",
                "fields": [
                    {"key": "orgName", "label": "Organisation Legal Name", "type": "text", "required": True},
                    {"key": "regNumber", "label": "Registration Number", "type": "text", "required": True},
                    {"key": "entityType", "label": "Entity Type", "type": "select", "required": True,
                     "options": ["NGO", "EdTech Non-profit", "Research Institution", "University"]},
                    {"key": "establishedYear", "label": "Year of Establishment", "type": "number", "required": True},
                    {"key": "budget", "label": "Annual Operating Budget (INR)", "type": "number", "required": True},
                    {"key": "contactName", "label": "Contact Person Name", "type": "text", "required": True},
                    {"key": "contactRole", "label": "Contact Person Role", "type": "text", "required": True},
                    {"key": "email", "label": "Contact Email", "type": "email", "required": True},
                    {"key": "phone", "label": "Contact Phone", "type": "tel", "required": True},
                    {"key": "address", "label": "Registered Address", "type": "text", "required": True},
                    {"key": "city", "label": "City", "type": "text", "required": True},
                    {"key": "stateRegion", "label": "State / Region", "type": "text", "required": True},
                    {"key": "postalCode", "label": "Postal Code", "type": "text", "required": True},
                ],
            },
            {
                "id": "project",
                "title": "Project Details — Education Innovation",
                "icon": "school",
                "description": "Describe your innovative education approach, pedagogy, and learning outcomes.",
                "fields": [
                    {"key": "projectTitle", "label": "Project Title", "type": "text", "required": True},
                    {"key": "projectLocation", "label": "Project Location (District, State)", "type": "text", "required": True},
                    {"key": "projectType", "label": "Innovation Type", "type": "select", "required": True,
                     "options": ["EdTech Platform", "Pedagogy Innovation", "Teacher Training", "Curriculum Design", "Assessment Tools", "Blended Learning"]},
                    {"key": "innovationDescription", "label": "Innovation & Novelty", "type": "textarea", "required": True,
                     "placeholder": "What is novel about your approach? How is it different from existing solutions?",
                     "rubric_hint": "Scored under 'Innovation & Novelty' (25%)"},
                    {"key": "problemStatement", "label": "Problem Statement", "type": "textarea", "required": True},
                    {"key": "proposedSolution", "label": "Proposed Solution", "type": "textarea", "required": True},
                    {"key": "learningOutcomes", "label": "Expected Learning Outcomes", "type": "textarea", "required": True,
                     "placeholder": "What measurable improvement in learning outcomes do you expect? Include specific metrics.",
                     "rubric_hint": "Scored under 'Educational Impact Potential' (25%)"},
                    {"key": "scalabilityPlan", "label": "Scalability & Sustainability Plan", "type": "textarea", "required": True,
                     "placeholder": "How will this be scaled beyond the pilot? What is the sustainability model?",
                     "rubric_hint": "Scored under 'Scalability & Sustainability' (15%)"},
                    {"key": "targetBeneficiaries", "label": "Target Students (Number)", "type": "number", "required": True},
                    {"key": "demographics", "label": "Student Demographics", "type": "text", "required": True},
                    {"key": "schoolsTargeted", "label": "Number of Schools Targeted", "type": "number", "required": True,
                     "placeholder": "Minimum 5 schools required", "min": 5},
                    {"key": "gradeCoverage", "label": "Grade Coverage", "type": "text", "required": True, "placeholder": "e.g. Grades 3-8"},
                    {"key": "startDate", "label": "Project Start Date", "type": "date", "required": True},
                    {"key": "endDate", "label": "Project End Date", "type": "date", "required": True},
                    {"key": "keyActivities", "label": "Key Activities & Milestones", "type": "textarea", "required": True},
                    {"key": "expectedOutcomes", "label": "Expected Outcomes & KPIs", "type": "textarea", "required": True},
                ],
            },
            {
                "id": "budget",
                "title": "Budget Details",
                "icon": "payments",
                "fields": [
                    {"key": "personnel", "label": "Personnel Costs (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "equipment", "label": "Technology & Equipment (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "travel", "label": "Travel & Field Visits (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "overheads", "label": "Overheads / Admin (INR)", "type": "number", "required": False, "budget_line": True, "overhead": True},
                    {"key": "other", "label": "Other / Miscellaneous (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "totalRequested", "label": "Total Amount Requested (INR)", "type": "number", "required": True, "readonly": True, "auto_sum": True},
                    {"key": "justification", "label": "Budget Justification & Efficiency", "type": "textarea", "required": True,
                     "rubric_hint": "Scored under 'Budget Efficiency' (15%)"},
                ],
                "rules": {
                    "overhead_cap_pct": 15,
                    "funding_min": 500000,
                    "funding_max": 5000000,
                    "budget_tolerance": 500,
                },
            },
            {
                "id": "experience",
                "title": "Team & Experience",
                "icon": "history_edu",
                "fields": [
                    {"key": "teamCapacity", "label": "Team & Organisational Capacity", "type": "textarea", "required": True,
                     "placeholder": "Describe your team's expertise in education, technology, and project delivery.",
                     "rubric_hint": "Scored under 'Team & Organisational Capacity' (20%)"},
                    {"key": "hasPreviousGrants", "label": "Has Received Previous Grants?", "type": "checkbox", "required": False},
                    {"key": "priorProjects", "label": "Prior Education Projects (describe 1-2)", "type": "textarea", "required": False},
                    {"key": "priorFunder", "label": "Previous Funder", "type": "text", "required": False},
                    {"key": "priorAmount", "label": "Previous Grant Amount (INR)", "type": "number", "required": False},
                    {"key": "signatoryName", "label": "Authorised Signatory Name", "type": "text", "required": True},
                    {"key": "designation", "label": "Designation", "type": "text", "required": True},
                    {"key": "submissionDate", "label": "Submission Date", "type": "date", "required": True},
                    {"key": "declared", "label": "I declare all information provided is true and accurate", "type": "checkbox", "required": True},
                ],
            },
        ],
    },

    "ECAG": {
        "code": "ECAG",
        "name": "Environment & Climate Action Grant",
        "sections": [
            {
                "id": "organisation",
                "title": "Organisation Details",
                "icon": "business",
                "fields": [
                    {"key": "orgName", "label": "Organisation Legal Name", "type": "text", "required": True},
                    {"key": "regNumber", "label": "Registration Number", "type": "text", "required": True},
                    {"key": "entityType", "label": "Entity Type", "type": "select", "required": True,
                     "options": ["NGO", "FPO", "Panchayat", "Research Institution"]},
                    {"key": "establishedYear", "label": "Year of Establishment", "type": "number", "required": True},
                    {"key": "budget", "label": "Annual Operating Budget (INR)", "type": "number", "required": True},
                    {"key": "contactName", "label": "Contact Person Name", "type": "text", "required": True},
                    {"key": "contactRole", "label": "Contact Person Role", "type": "text", "required": True},
                    {"key": "email", "label": "Contact Email", "type": "email", "required": True},
                    {"key": "phone", "label": "Contact Phone", "type": "tel", "required": True},
                    {"key": "address", "label": "Registered Address", "type": "text", "required": True},
                    {"key": "city", "label": "City", "type": "text", "required": True},
                    {"key": "stateRegion", "label": "State / Region", "type": "text", "required": True},
                    {"key": "postalCode", "label": "Postal Code", "type": "text", "required": True},
                ],
            },
            {
                "id": "project",
                "title": "Project Details — Climate & Environment",
                "icon": "eco",
                "description": "Describe your environmental conservation or climate resilience project.",
                "fields": [
                    {"key": "projectTitle", "label": "Project Title", "type": "text", "required": True},
                    {"key": "projectLocation", "label": "Project Location (District, State)", "type": "text", "required": True,
                     "placeholder": "Priority given to climate-vulnerable districts"},
                    {"key": "projectType", "label": "Environmental Focus Area", "type": "select", "required": True,
                     "options": ["Conservation", "Climate Resilience", "Clean Energy", "Water Management", "Biodiversity", "Waste Management", "Sustainable Agriculture"]},
                    {"key": "environmentalImpact", "label": "Environmental Impact & Urgency", "type": "textarea", "required": True,
                     "placeholder": "Describe the environmental problem and why immediate action is needed.",
                     "rubric_hint": "Scored under 'Environmental Impact & Urgency' (30%)"},
                    {"key": "problemStatement", "label": "Problem Statement", "type": "textarea", "required": True},
                    {"key": "proposedSolution", "label": "Proposed Solution", "type": "textarea", "required": True},
                    {"key": "communityOwnership", "label": "Community Ownership & Inclusion Plan", "type": "textarea", "required": True,
                     "placeholder": "How will the local community be involved in planning, execution, and maintenance?",
                     "rubric_hint": "Scored under 'Community Ownership & Inclusion' (25%)"},
                    {"key": "technicalMethodology", "label": "Technical Methodology & Soundness", "type": "textarea", "required": True,
                     "placeholder": "Describe the scientific/technical approach. Include metrics for measurement.",
                     "rubric_hint": "Scored under 'Technical Soundness' (20%)"},
                    {"key": "climateMetrics", "label": "Climate/Environmental Metrics", "type": "textarea", "required": True,
                     "placeholder": "e.g. CO2 offset (tonnes), hectares restored, species protected, households with clean energy"},
                    {"key": "targetBeneficiaries", "label": "Target Beneficiaries (Number)", "type": "number", "required": True},
                    {"key": "demographics", "label": "Beneficiary Demographics", "type": "text", "required": True},
                    {"key": "startDate", "label": "Project Start Date", "type": "date", "required": True},
                    {"key": "endDate", "label": "Project End Date", "type": "date", "required": True},
                    {"key": "keyActivities", "label": "Key Activities", "type": "textarea", "required": True},
                    {"key": "expectedOutcomes", "label": "Expected Outcomes", "type": "textarea", "required": True},
                ],
            },
            {
                "id": "budget",
                "title": "Budget Details",
                "icon": "payments",
                "fields": [
                    {"key": "personnel", "label": "Personnel Costs (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "equipment", "label": "Equipment & Materials (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "travel", "label": "Travel & Field Work (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "overheads", "label": "Overheads / Admin (INR)", "type": "number", "required": False, "budget_line": True, "overhead": True},
                    {"key": "other", "label": "Other / Miscellaneous (INR)", "type": "number", "required": False, "budget_line": True},
                    {"key": "totalRequested", "label": "Total Amount Requested (INR)", "type": "number", "required": True, "readonly": True, "auto_sum": True},
                    {"key": "justification", "label": "Budget Justification & Sustainability", "type": "textarea", "required": True,
                     "rubric_hint": "Scored under 'Budget Realism & Sustainability' (10%)"},
                ],
                "rules": {
                    "overhead_cap_pct": 15,
                    "funding_min": 300000,
                    "funding_max": 3000000,
                    "budget_tolerance": 500,
                },
            },
            {
                "id": "experience",
                "title": "Capacity & Declaration",
                "icon": "history_edu",
                "fields": [
                    {"key": "orgCapacity", "label": "Organisation & Team Capacity", "type": "textarea", "required": True,
                     "placeholder": "Describe your team's environmental expertise and past conservation work.",
                     "rubric_hint": "Scored under 'Organisation & Team Capacity' (15%)"},
                    {"key": "hasPreviousGrants", "label": "Has Received Previous Grants?", "type": "checkbox", "required": False},
                    {"key": "priorProjects", "label": "Prior Environmental Projects (describe 1-2)", "type": "textarea", "required": False},
                    {"key": "priorFunder", "label": "Previous Funder", "type": "text", "required": False},
                    {"key": "priorAmount", "label": "Previous Grant Amount (INR)", "type": "number", "required": False},
                    {"key": "signatoryName", "label": "Authorised Signatory Name", "type": "text", "required": True},
                    {"key": "designation", "label": "Designation", "type": "text", "required": True},
                    {"key": "submissionDate", "label": "Submission Date", "type": "date", "required": True},
                    {"key": "declared", "label": "I declare all information provided is true and accurate", "type": "checkbox", "required": True},
                ],
            },
        ],
    },
}


def get_required_fields(grant_type: str) -> list[str]:
    """Return list of required field keys for a grant type."""
    meta = GRANT_METADATA.get(grant_type)
    if not meta:
        return []
    required = []
    for section in meta["sections"]:
        for field in section["fields"]:
            if field.get("required"):
                required.append(field["key"])
    return required


def get_budget_rules(grant_type: str) -> dict:
    """Return budget validation rules for a grant type."""
    meta = GRANT_METADATA.get(grant_type)
    if not meta:
        return {}
    for section in meta["sections"]:
        if section["id"] == "budget" and "rules" in section:
            return section["rules"]
    return {}


def validate_application_fields(grant_type: str, form_data: dict) -> list[str]:
    """Validate that all required fields are present and budget rules are met.
    Returns list of error messages (empty = valid)."""
    errors = []
    required = get_required_fields(grant_type)

    for key in required:
        val = form_data.get(key)
        if val is None or val == "" or val == 0:
            # Allow 0 for totalRequested if budget lines exist
            if key == "totalRequested":
                continue
            errors.append(f"Missing required field: {key}")

    # Budget rules
    rules = get_budget_rules(grant_type)
    if rules:
        total = float(form_data.get("totalRequested", 0) or 0)
        overheads = float(form_data.get("overheads", 0) or 0)

        # Overhead cap
        cap = rules.get("overhead_cap_pct", 15)
        if total > 0 and overheads > 0:
            overhead_pct = (overheads / total) * 100
            if overhead_pct > cap:
                errors.append(f"Overhead costs ({overhead_pct:.1f}%) exceed the {cap}% cap")

        # Funding range
        fmin = rules.get("funding_min", 0)
        fmax = rules.get("funding_max", float("inf"))
        if total > 0 and (total < fmin or total > fmax):
            errors.append(f"Total requested INR {total:,.0f} outside allowed range INR {fmin:,.0f} – {fmax:,.0f}")

        # Budget line sum match
        budget_keys = ["personnel", "equipment", "travel", "overheads", "other"]
        line_sum = sum(float(form_data.get(k, 0) or 0) for k in budget_keys)
        tolerance = rules.get("budget_tolerance", 500)
        if total > 0 and abs(line_sum - total) > tolerance:
            errors.append(f"Budget lines sum (INR {line_sum:,.0f}) does not match total requested (INR {total:,.0f})")

    return errors
