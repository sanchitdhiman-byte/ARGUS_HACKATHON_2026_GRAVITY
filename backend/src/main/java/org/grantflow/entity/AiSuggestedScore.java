package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_suggested_scores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSuggestedScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "review_package_id")
    private UUID reviewPackageId;

    @Column(name = "rubric_dimension_id")
    private UUID rubricDimensionId;

    @Column(name = "suggested_score")
    private Integer suggestedScore;

    @Column(columnDefinition = "TEXT")
    private String justification;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
