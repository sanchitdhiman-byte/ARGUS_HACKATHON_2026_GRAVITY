package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {
    PENDING_VERIFICATION("pending_verification"),
    ACTIVE("active"),
    SUSPENDED("suspended"),
    DEACTIVATED("deactivated");

    @JsonValue
    private final String value;
}
