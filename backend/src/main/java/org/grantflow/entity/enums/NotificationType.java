package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
    APPLICATION_SUBMITTED("application_submitted"),
    STATUS_CHANGE("status_change"),
    REVIEW_ASSIGNED("review_assigned"),
    REVIEW_COMPLETED("review_completed"),
    DECISION_MADE("decision_made"),
    AGREEMENT_READY("agreement_ready"),
    DISBURSEMENT_PROCESSED("disbursement_processed"),
    REPORT_DUE("report_due"),
    REPORT_REVIEWED("report_reviewed"),
    MESSAGE_RECEIVED("message_received"),
    DEADLINE_REMINDER("deadline_reminder"),
    SYSTEM_ALERT("system_alert"),
    COMPLIANCE_FLAG("compliance_flag");

    @JsonValue
    private final String value;
}
