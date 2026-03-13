package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    PLATFORM_ADMIN("platform_admin"),
    PROGRAM_OFFICER("program_officer"),
    GRANT_REVIEWER("grant_reviewer"),
    FINANCE_OFFICER("finance_officer"),
    APPLICANT("applicant");

    @JsonValue
    private final String value;
}
