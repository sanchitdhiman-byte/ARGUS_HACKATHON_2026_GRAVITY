package org.grantflow.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GrantAgreementRequest {
    private LocalDate agreementDate;

    private BigDecimal awardAmount;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reportingSchedule;

    private String specialConditions;
}
