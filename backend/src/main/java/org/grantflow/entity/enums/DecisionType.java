package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DecisionType {
    APPROVED("approved"),
    REJECTED("rejected"),
    WAITLISTED("waitlisted");

    @JsonValue
    private final String value;
}
