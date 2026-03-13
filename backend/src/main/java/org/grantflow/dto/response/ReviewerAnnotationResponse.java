package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ReviewerAnnotationResponse {
    private UUID id;
    private UUID assignmentId;
    private String highlightedText;
    private String note;
    private String fieldReference;
    private OffsetDateTime createdAt;
}
