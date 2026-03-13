package org.grantflow.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.UUID;

@Data
public class ReviewScoreRequest {
    private UUID rubricDimensionId;

    @Min(1)
    @Max(5)
    private Integer finalScore;

    private String overrideComment;
}
