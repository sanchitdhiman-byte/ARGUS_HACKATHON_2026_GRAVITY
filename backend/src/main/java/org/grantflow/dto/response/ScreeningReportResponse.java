package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ScreeningReportResponse {
    private UUID id;
    private UUID applicationId;
    private String overallResult;
    private Integer hardChecksTotal;
    private Integer hardChecksPassed;
    private Integer softChecksTotal;
    private Integer softChecksPassed;
    private UUID reviewedBy;
    private String reviewAction;
    private String reviewReason;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<CheckItem> checks;

    @Data
    @Builder
    public static class CheckItem {
        private UUID id;
        private UUID criterionId;
        private String criterionName;
        private String criterionCode;
        private Boolean isHardRule;
        private String result;
        private String details;
    }
}
