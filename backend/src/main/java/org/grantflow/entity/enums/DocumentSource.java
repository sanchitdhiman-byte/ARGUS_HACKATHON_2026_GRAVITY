package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DocumentSource {
    VAULT("vault"),
    DIRECT_UPLOAD("direct_upload");

    @JsonValue
    private final String value;
}
