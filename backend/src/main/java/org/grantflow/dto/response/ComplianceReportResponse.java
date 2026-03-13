package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class ComplianceReportResponse {
    private UUID id;
    private UUID agreementId;
    private String reportType;
    private Integer reportNumber;
    private String status;
    private LocalDate dueDate;
    private OffsetDateTime submittedAt;
    private Map<String, Object> reportData;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<AttachmentItem> attachments;

    @Data
    @Builder
    public static class AttachmentItem {
        private UUID id;
        private String documentName;
        private String filePath;
        private Long fileSize;
        private String mimeType;
    }
}
