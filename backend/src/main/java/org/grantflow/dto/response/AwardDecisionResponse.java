package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class AwardDecisionResponse {
    private UUID id;
    private UUID applicationId;
    private String applicationReference;
    private String programmeName;
    private String decision;
    private String reason;
    private BigDecimal compositeScore;
    private UUID decidedBy;
    private String decidedByName;
    private OffsetDateTime createdAt;
}
