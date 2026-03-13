package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviewer_annotations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewerAnnotation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "assignment_id")
    private UUID assignmentId;

    @Column(name = "highlighted_text", columnDefinition = "TEXT")
    private String highlightedText;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "field_reference")
    private String fieldReference;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
