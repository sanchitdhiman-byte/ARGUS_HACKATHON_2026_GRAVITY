package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.ComplianceRating;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "compliance_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "report_id", unique = true)
    private UUID reportId;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_rating")
    private ComplianceRating contentRating;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_analysis", columnDefinition = "jsonb")
    private Map<String, Object> contentAnalysis;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "financial_analysis", columnDefinition = "jsonb")
    private Map<String, Object> financialAnalysis;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String flags;

    @Column(name = "recommended_action", columnDefinition = "TEXT")
    private String recommendedAction;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
