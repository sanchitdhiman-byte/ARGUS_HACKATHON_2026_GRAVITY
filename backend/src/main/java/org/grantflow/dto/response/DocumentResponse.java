package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class DocumentResponse {
    private UUID id;
    private String documentName;
    private String filePath;
    private Long fileSize;
    private String mimeType;
    private String source;
    private UUID uploadedBy;
    private OffsetDateTime createdAt;
}
