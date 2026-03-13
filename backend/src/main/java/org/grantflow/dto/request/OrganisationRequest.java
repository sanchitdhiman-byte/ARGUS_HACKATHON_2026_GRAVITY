package org.grantflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrganisationRequest {
    @NotBlank
    private String legalName;

    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String orgType;

    private Integer yearEstablished;

    private String district;

    private String state;

    private String address;

    private String contactEmail;

    private String contactPhone;

    private String website;

    private BigDecimal annualOperatingBudget;
}
