package org.grantflow.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DisbursementRequest {
    private String trancheLabel;

    private String trancheType;

    private BigDecimal amount;

    private String triggerCondition;
}
