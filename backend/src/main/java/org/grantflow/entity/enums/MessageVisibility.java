package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MessageVisibility {
    APPLICANT_VISIBLE("applicant_visible"),
    INTERNAL_ONLY("internal_only");

    @JsonValue
    private final String value;
}
