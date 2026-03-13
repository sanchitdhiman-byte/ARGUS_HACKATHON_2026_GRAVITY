package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class GrantAgreementResponse {
    private UUID id;
    private UUID applicationId;
    private String grantReference;
    private LocalDate agreementDate;
    private BigDecimal awardAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reportingSchedule;
    private String specialConditions;
    private String agreementPdfPath;
    private OffsetDateTime sentAt;
    private OffsetDateTime acknowledgedAt;
    private OffsetDateTime createdAt;
    private BankDetailResponse bankDetails;
    private List<TrancheItem> tranches;

    @Data
    @Builder
    public static class TrancheItem {
        private UUID id;
        private String trancheLabel;
        private String trancheType;
        private BigDecimal amount;
        private String triggerCondition;
        private String status;
        private String paymentReference;
        private OffsetDateTime processedAt;
    }
}
