package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReviewStatus {
    ASSIGNED("assigned"),
    IN_PROGRESS("in_progress"),
    COMPLETED("completed"),
    RECUSED("recused");

    @JsonValue
    private final String value;
}
