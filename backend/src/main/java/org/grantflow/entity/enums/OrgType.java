package org.grantflow.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrgType {
    NGO("ngo"),
    TRUST("trust"),
    SECTION_8_COMPANY("section_8_company"),
    FPO("fpo"),
    EDTECH_NONPROFIT("edtech_nonprofit"),
    RESEARCH_INSTITUTION("research_institution"),
    UNIVERSITY("university"),
    PANCHAYAT("panchayat");

    @JsonValue
    private final String value;
}
