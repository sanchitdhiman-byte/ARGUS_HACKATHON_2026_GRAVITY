package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ComplianceRating {
    SATISFACTORY("satisfactory"),
    NEEDS_IMPROVEMENT("needs_improvement"),
    UNSATISFACTORY("unsatisfactory");

    @JsonValue
    private final String value;
}
