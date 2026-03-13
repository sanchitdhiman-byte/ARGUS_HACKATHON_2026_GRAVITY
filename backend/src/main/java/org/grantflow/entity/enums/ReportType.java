package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportType {
    QUARTERLY("quarterly"),
    MID_TERM("mid_term"),
    ANNUAL("annual"),
    FINAL_COMPLETION("final_completion");

    @JsonValue
    private final String value;
}
