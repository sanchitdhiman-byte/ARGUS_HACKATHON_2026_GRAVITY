"""Application status state machine — defines valid transitions."""

from fastapi import HTTPException
from app.models.models import ApplicationStatusEnum as S


VALID_TRANSITIONS = {
    S.draft:                    [S.submitted, S.screening],
    S.submitted:                [S.screening],
    S.screening:                [S.eligible, S.ineligible, S.pending_review, S.risk_flagged],
    S.eligible:                 [S.pending_review],
    S.ineligible:               [S.pending_review, S.rejected],  # override path
    S.pending_review:           [S.assigned, S.under_review],
    S.assigned:                 [S.under_review, S.pending_review],
    S.under_review:             [S.reviewed, S.risk_flagged],
    S.reviewed:                 [S.approved, S.rejected, S.waitlisted],
    S.risk_flagged:             [S.pending_review, S.assigned, S.rejected],
    S.approved:                 [S.agreement_sent, S.active_reporting],
    S.agreement_sent:           [S.agreement_acknowledged],
    S.agreement_acknowledged:   [S.active_reporting],
    S.active_reporting:         [S.closed],
    S.waitlisted:               [S.pending_review, S.assigned, S.rejected],
}


def validate_transition(current_status, new_status):
    """Raise 400 if the status transition is invalid."""
    allowed = VALID_TRANSITIONS.get(current_status, [])
    if new_status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid transition from '{current_status.value}' to '{new_status.value}'. "
                   f"Allowed: {[s.value for s in allowed]}",
        )


def get_transition_map():
    """Return the full transition map as a serialisable dict."""
    return {
        status.value: [t.value for t in targets]
        for status, targets in VALID_TRANSITIONS.items()
    }
