package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.DecisionType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "award_decisions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwardDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id", unique = true)
    private UUID applicationId;

    @Enumerated(EnumType.STRING)
    private DecisionType decision;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "decided_by")
    private UUID decidedBy;

    @Column(name = "composite_score")
    private BigDecimal compositeScore;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
