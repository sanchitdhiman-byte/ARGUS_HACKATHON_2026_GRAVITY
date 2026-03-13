package org.grantflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AwardDecisionRequest {
    @NotBlank
    private String decision;

    private String reason;

    private BigDecimal compositeScore;
}
