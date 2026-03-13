package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class ApplicationResponse {
    private UUID id;
    private String referenceNumber;
    private String status;
    private Integer currentStage;
    private Map<String, Object> formData;
    private OffsetDateTime submittedAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    private UUID programmeId;
    private String programmeName;
    private String programmeCode;

    private UUID applicantId;
    private String applicantName;
    private String applicantEmail;

    private UUID organisationId;
    private String organisationName;

    private List<DocumentItem> documents;

    @Data
    @Builder
    public static class DocumentItem {
        private UUID id;
        private String documentName;
        private String filePath;
        private Long fileSize;
        private String mimeType;
        private String source;
        private OffsetDateTime createdAt;
    }
}
