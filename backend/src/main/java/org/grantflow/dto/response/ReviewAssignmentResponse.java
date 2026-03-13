package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ReviewAssignmentResponse {
    private UUID id;
    private UUID applicationId;
    private String reviewerName;
    private String reviewerEmail;
    private String status;
    private LocalDate dueDate;
    private List<ReviewScoreResponse> scores;
}
