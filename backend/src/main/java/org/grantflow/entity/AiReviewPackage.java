package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_review_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiReviewPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id", unique = true)
    private UUID applicationId;

    @Column(name = "summary_text", columnDefinition = "TEXT")
    private String summaryText;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
