package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.RiskSeverity;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_risk_flags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiRiskFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "review_package_id")
    private UUID reviewPackageId;

    @Column(name = "risk_category")
    private String riskCategory;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private RiskSeverity severity;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
