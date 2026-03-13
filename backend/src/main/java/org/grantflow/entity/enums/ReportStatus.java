package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportStatus {
    PENDING("pending"),
    SUBMITTED("submitted"),
    UNDER_REVIEW("under_review"),
    ACCEPTED("accepted"),
    REVISION_REQUESTED("revision_requested");

    @JsonValue
    private final String value;
}
