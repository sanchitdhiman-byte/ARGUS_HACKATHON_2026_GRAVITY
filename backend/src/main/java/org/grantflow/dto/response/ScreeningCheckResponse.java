package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ScreeningCheckResponse {
    private UUID id;
    private String criterionCode;
    private String criterionName;
    private String result;
    private String details;
    private BigDecimal aiScore;
}
