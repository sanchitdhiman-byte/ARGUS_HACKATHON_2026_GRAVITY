package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.ScreeningResult;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "screening_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreeningReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id", unique = true)
    private UUID applicationId;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_result")
    private ScreeningResult overallResult;

    @Column(name = "hard_checks_total")
    private Integer hardChecksTotal;

    @Column(name = "hard_checks_passed")
    private Integer hardChecksPassed;

    @Column(name = "soft_checks_total")
    private Integer softChecksTotal;

    @Column(name = "soft_checks_passed")
    private Integer softChecksPassed;

    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    @Column(name = "review_action")
    private String reviewAction;

    @Column(name = "review_reason")
    private String reviewReason;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
