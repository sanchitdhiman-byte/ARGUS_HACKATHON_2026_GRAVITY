package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.GrantTypeCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grant_programmes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrantProgramme {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private GrantTypeCode code;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "funding_min")
    private BigDecimal fundingMin;

    @Column(name = "funding_max")
    private BigDecimal fundingMax;

    @Column(name = "duration_min_months")
    private Integer durationMinMonths;

    @Column(name = "duration_max_months")
    private Integer durationMaxMonths;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "eligible_org_types", columnDefinition = "text[]")
    private String[] eligibleOrgTypes;

    @Column(name = "geographic_focus")
    private String geographicFocus;

    @Column(name = "annual_cycle")
    private String annualCycle;

    @Column(name = "max_awards_per_cycle")
    private Integer maxAwardsPerCycle;

    @Column(name = "total_programme_budget")
    private BigDecimal totalProgrammeBudget;

    @Column(name = "overhead_cap_percent")
    private Integer overheadCapPercent;

    @Column(name = "reviewers_required")
    private Integer reviewersRequired;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
