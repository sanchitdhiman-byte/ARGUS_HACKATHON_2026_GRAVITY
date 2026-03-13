import os

base = "D:/argus/ARGUS_HACKATHON_2026_GRAVITY/services/application-service/routers"

applications_py = """\
import json
import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas
from auth_verify import get_current_user, CurrentUser
from helpers import create_audit_log, create_notification

router = APIRouter(tags=["applications"])


def _f(val):
    try: return float(val) if val is not None else 0.0
    except: return 0.0

def _i(val):
    try: return int(val) if val is not None else 0
    except: return 0


@router.post("/applications", response_model=schemas.ApplicationResponse, status_code=201)
def create_application(
    app_comp: schemas.ApplicationCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    ref_id = f"APP-{app_comp.grantType}-2026-{int(time.time() * 1000) % 10000:04d}"
    fd = app_comp.formData
    req_amt = _f(fd.get("totalRequested"))

    summary = (
        f"Applicant {fd.get('orgName', 'Unknown')} proposes: "
        f"{str(fd.get('problemStatement', ''))[:80]}... with budget \\u20b9{req_amt:,.0f}"
    )
    base_score = 70
    if len(str(fd.get("problemStatement", ""))) > 100: base_score += 10
    if len(str(fd.get("proposedSolution", ""))) > 100: base_score += 10
    if req_amt == 0: base_score -= 30

    new_app = models.Application(
        reference_id=ref_id, applicant_id=current_user.id, grant_type=app_comp.grantType,
        org_name=fd.get("orgName"), reg_number=fd.get("regNumber"), entity_type=fd.get("entityType"),
        established_year=_i(fd.get("establishedYear")), org_budget=_f(fd.get("budget")),
        contact_name=fd.get("contactName"), contact_role=fd.get("contactRole"),
        contact_email=fd.get("email"), contact_phone=fd.get("phone"),
        address=fd.get("address"), city=fd.get("city"), state_region=fd.get("stateRegion"),
        postal_code=fd.get("postalCode"), project_title=fd.get("projectTitle"),
        project_location=fd.get("projectLocation"), target_beneficiaries=_i(fd.get("targetBeneficiaries")),
        problem_statement=fd.get("problemStatement"), proposed_solution=fd.get("proposedSolution"),
        sustainability_plan=fd.get("sustainabilityPlan"), schools_targeted=_i(fd.get("schoolsTargeted")),
        grade_coverage=fd.get("gradeCoverage"), total_requested=req_amt,
        budget_personnel=_f(fd.get("personnel")), budget_equipment=_f(fd.get("equipment")),
        budget_travel=_f(fd.get("travel")), budget_overheads=_f(fd.get("overheads")),
        budget_other=_f(fd.get("other")), budget_justification=fd.get("justification"),
        prior_projects=json.dumps(fd.get("priorProjects", [])),
        has_previous_grants=bool(fd.get("hasPreviousGrants")),
        prior_funder=fd.get("priorFunder"), prior_amount=_f(fd.get("priorAmount")),
        signatory_name=fd.get("signatoryName"), designation=fd.get("designation"),
        submission_date=fd.get("submissionDate"), declared=bool(fd.get("declared")),
        start_date=fd.get("startDate"), end_date=fd.get("endDate"),
        district=fd.get("district"), state=fd.get("state") or fd.get("stateRegion"),
        project_type=fd.get("projectType"), beneficiary_demographics=fd.get("beneficiaryDemographics"),
        key_activities=json.dumps(fd.get("keyActivities", [])) if fd.get("keyActivities") else None,
        expected_outcomes=fd.get("expectedOutcomes"), annual_operating_budget=_f(fd.get("annualOperatingBudget")),
        innovation_type=fd.get("innovationType"), target_schools_districts=fd.get("targetSchoolsDistricts"),
        number_of_schools=_i(fd.get("numberOfSchools")), number_of_students=_i(fd.get("numberOfStudents")),
        grade_levels=fd.get("gradeLevels"), tech_tools=fd.get("techTools"), evidence_base=fd.get("evidenceBase"),
        team_lead_name=fd.get("teamLeadName"), team_size=_i(fd.get("teamSize")),
        team_expertise=fd.get("teamExpertise"), key_partners=fd.get("keyPartners"),
        primary_learning_outcome=fd.get("primaryLearningOutcome"), measurement_plan=fd.get("measurementPlan"),
        baseline_assessment_plan=fd.get("baselineAssessmentPlan"),
        milestones=json.dumps(fd.get("milestones", [])) if fd.get("milestones") else None,
        budget_technology=_f(fd.get("budgetTechnology")), budget_training=_f(fd.get("budgetTraining")),
        budget_content=_f(fd.get("budgetContent")), thematic_area=fd.get("thematicArea"),
        environmental_problem=fd.get("environmentalProblem"), proposed_intervention=fd.get("proposedIntervention"),
        geographic_coverage=fd.get("geographicCoverage"), community_involvement_plan=fd.get("communityInvolvementPlan"),
        environmental_indicators=json.dumps(fd.get("environmentalIndicators", [])) if fd.get("environmentalIndicators") else None,
        climate_vulnerability_context=fd.get("climateVulnerabilityContext"),
        risk_of_not_acting=fd.get("riskOfNotActing"), government_partnerships=fd.get("governmentPartnerships"),
        activity_plan=json.dumps(fd.get("activityPlan", [])) if fd.get("activityPlan") else None,
        budget_community_wages=_f(fd.get("budgetCommunityWages")),
        budget_saplings=_f(fd.get("budgetSaplings")), budget_technical_expertise=_f(fd.get("budgetTechnicalExpertise")),
        status=models.ApplicationStatusEnum.screening, screening_status="pending",
        ai_score=min(100, max(0, base_score)), ai_summary=summary,
    )
    db.add(new_app)
    create_audit_log(db, current_user.id, current_user.email, "application.submitted", "application",
                     detail={"grant_type": app_comp.grantType, "amount": req_amt})
    db.commit()
    db.refresh(new_app)
    return schemas.ApplicationResponse(
        id=new_app.id, reference_id=new_app.reference_id, applicant_id=new_app.applicant_id,
        status=new_app.status, grant_type=new_app.grant_type, org_name=new_app.org_name or "",
        requested_amount=new_app.total_requested or 0.0, submitted_at=new_app.submitted_at,
        ai_score=new_app.ai_score or 0, ai_summary=new_app.ai_summary,
        screening_status=new_app.screening_status, final_decision=new_app.final_decision,
    )


@router.get("/applications", response_model=list[schemas.ApplicationResponse])
def list_applications(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    if current_user.role == "applicant":
        apps = db.query(models.Application).filter(models.Application.applicant_id == current_user.id).all()
    else:
        apps = db.query(models.Application).all()
    return [schemas.ApplicationResponse(
        id=a.id, reference_id=a.reference_id, applicant_id=a.applicant_id, status=a.status,
        grant_type=a.grant_type, org_name=a.org_name or "", requested_amount=a.total_requested or 0.0,
        submitted_at=a.submitted_at, ai_score=a.ai_score or 0, ai_summary=a.ai_summary,
        screening_status=a.screening_status, final_decision=a.final_decision,
    ) for a in apps]


@router.get("/applications/{app_id}", response_model=schemas.ApplicationDetailResponse)
def get_application(
    app_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role == "applicant" and app.applicant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised")
    return app


@router.get("/my-applications", response_model=list[schemas.ApplicationResponse])
def my_applications(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    if current_user.role == "applicant":
        apps = db.query(models.Application).filter(models.Application.applicant_id == current_user.id).all()
    else:
        apps = db.query(models.Application).all()
    return [schemas.ApplicationResponse(
        id=a.id, reference_id=a.reference_id, applicant_id=a.applicant_id, status=a.status,
        grant_type=a.grant_type, org_name=a.org_name or "", requested_amount=a.total_requested or 0.0,
        submitted_at=a.submitted_at, ai_score=a.ai_score or 0, ai_summary=a.ai_summary,
        screening_status=a.screening_status, final_decision=a.final_decision,
    ) for a in apps]


@router.post("/applications/{app_id}/assign")
def assign_legacy(app_id: int, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(database.get_db)):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorised")
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app: raise HTTPException(status_code=404, detail="Not found")
    app.status = models.ApplicationStatusEnum.assigned
    db.commit()
    return {"message": "Application assigned"}


@router.post("/applications/{app_id}/approve")
def approve_legacy(app_id: int, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(database.get_db)):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorised")
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app: raise HTTPException(status_code=404, detail="Not found")
    app.status = models.ApplicationStatusEnum.approved
    app.final_decision = "approved"
    db.commit()
    return {"message": "Application approved"}


@router.post("/applications/{app_id}/reject")
def reject_legacy(app_id: int, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(database.get_db)):
    if current_user.role not in ["officer", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorised")
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app: raise HTTPException(status_code=404, detail="Not found")
    app.status = models.ApplicationStatusEnum.rejected
    app.final_decision = "rejected"
    db.commit()
    return {"message": "Application rejected"}
"""

with open(os.path.join(base, "applications.py"), "w", encoding="utf-8") as f:
    f.write(applications_py)

print("applications.py written")
