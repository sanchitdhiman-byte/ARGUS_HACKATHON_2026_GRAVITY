package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScreeningResult {
    ELIGIBLE("eligible"),
    INELIGIBLE("ineligible"),
    NEEDS_MANUAL_REVIEW("needs_manual_review");

    @JsonValue
    private final String value;
}
