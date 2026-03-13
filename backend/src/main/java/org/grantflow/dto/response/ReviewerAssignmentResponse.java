package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ReviewerAssignmentResponse {
    private UUID id;
    private UUID applicationId;
    private String applicationReference;
    private UUID reviewerId;
    private String reviewerName;
    private String reviewerEmail;
    private String status;
    private LocalDate dueDate;
    private OffsetDateTime createdAt;
}
