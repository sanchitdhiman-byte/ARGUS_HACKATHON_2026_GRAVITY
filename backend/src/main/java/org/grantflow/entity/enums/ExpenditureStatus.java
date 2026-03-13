package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExpenditureStatus {
    SUBMITTED("submitted"),
    VERIFIED("verified"),
    FLAGGED("flagged"),
    REJECTED("rejected");

    @JsonValue
    private final String value;
}
