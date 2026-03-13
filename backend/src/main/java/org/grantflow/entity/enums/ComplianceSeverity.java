package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ComplianceSeverity {
    MINOR("minor"),
    MAJOR("major"),
    CRITICAL("critical");

    @JsonValue
    private final String value;
}
