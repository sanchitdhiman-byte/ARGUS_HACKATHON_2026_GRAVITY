package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TrancheType {
    UPFRONT("upfront"),
    MILESTONE("milestone"),
    COMPLETION("completion");

    @JsonValue
    private final String value;
}
