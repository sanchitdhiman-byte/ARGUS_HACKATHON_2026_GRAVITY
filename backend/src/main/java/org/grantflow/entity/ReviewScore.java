package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "review_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "assignment_id")
    private UUID assignmentId;

    @Column(name = "rubric_dimension_id")
    private UUID rubricDimensionId;

    @Column(name = "ai_suggested_score")
    private Integer aiSuggestedScore;

    @Column(name = "final_score")
    private Integer finalScore;

    @Column(name = "override_comment", columnDefinition = "TEXT")
    private String overrideComment;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
