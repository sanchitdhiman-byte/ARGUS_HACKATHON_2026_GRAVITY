package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class DisbursementTrancheResponse {
    private UUID id;
    private UUID agreementId;
    private String trancheLabel;
    private String trancheType;
    private BigDecimal amount;
    private String triggerCondition;
    private String status;
    private String paymentReference;
    private OffsetDateTime processedAt;
    private OffsetDateTime createdAt;
}
