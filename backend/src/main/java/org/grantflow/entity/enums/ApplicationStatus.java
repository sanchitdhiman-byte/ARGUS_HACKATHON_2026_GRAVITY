package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApplicationStatus {
    DRAFT("draft"),
    SUBMITTED("submitted"),
    SCREENING("screening"),
    ELIGIBLE("eligible"),
    INELIGIBLE("ineligible"),
    UNDER_REVIEW("under_review"),
    REVIEW_COMPLETE("review_complete"),
    APPROVED("approved"),
    REJECTED("rejected"),
    WAITLISTED("waitlisted"),
    AGREEMENT_SENT("agreement_sent"),
    AGREEMENT_ACKNOWLEDGED("agreement_acknowledged"),
    ACTIVE("active"),
    REPORT_DUE("report_due"),
    REPORT_SUBMITTED("report_submitted"),
    REPORT_REVIEWED("report_reviewed"),
    CLOSED("closed");

    @JsonValue
    private final String value;
}
