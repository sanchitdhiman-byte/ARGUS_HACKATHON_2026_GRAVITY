package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class OrganisationResponse {
    private UUID id;
    private String legalName;
    private String registrationNumber;
    private String orgType;
    private Integer yearEstablished;
    private String district;
    private String state;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private String website;
    private BigDecimal annualOperatingBudget;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
