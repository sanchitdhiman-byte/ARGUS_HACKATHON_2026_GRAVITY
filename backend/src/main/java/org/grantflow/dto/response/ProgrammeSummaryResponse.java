package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ProgrammeSummaryResponse {
    private UUID id;
    private String code;
    private String name;
    private String purpose;
    private BigDecimal fundingMin;
    private BigDecimal fundingMax;
    private Integer durationMinMonths;
    private Integer durationMaxMonths;
}
