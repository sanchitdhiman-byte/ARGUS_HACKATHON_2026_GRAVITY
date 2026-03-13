package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ReviewScoreResponse {
    private UUID id;
    private UUID assignmentId;
    private UUID rubricDimensionId;
    private String dimensionName;
    private Integer weightPercent;
    private Integer aiSuggestedScore;
    private Integer finalScore;
    private String overrideComment;
}
