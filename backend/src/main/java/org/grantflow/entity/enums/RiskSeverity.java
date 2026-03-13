package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RiskSeverity {
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high");

    @JsonValue
    private final String value;
}
