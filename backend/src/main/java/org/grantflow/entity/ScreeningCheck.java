package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.ScreeningResult;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "screening_checks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreeningCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "screening_report_id")
    private UUID screeningReportId;

    @Column(name = "criterion_id")
    private UUID criterionId;

    @Enumerated(EnumType.STRING)
    private ScreeningResult result;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "ai_score")
    private BigDecimal aiScore;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
