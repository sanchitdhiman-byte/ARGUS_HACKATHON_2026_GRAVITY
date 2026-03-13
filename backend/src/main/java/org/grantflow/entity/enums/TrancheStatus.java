package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TrancheStatus {
    PENDING("pending"),
    APPROVED("approved"),
    DISBURSED("disbursed"),
    ON_HOLD("on_hold"),
    CANCELLED("cancelled");

    @JsonValue
    private final String value;
}
