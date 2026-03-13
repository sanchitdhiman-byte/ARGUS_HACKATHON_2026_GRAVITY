package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GrantTypeCode {
    CDG("CDG"),
    EIG("EIG"),
    ECAG("ECAG");

    @JsonValue
    private final String value;
}
