package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.ComplianceSeverity;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "report_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "report_id")
    private UUID reportId;

    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    private String action;

    @Enumerated(EnumType.STRING)
    @Column(name = "compliance_severity")
    private ComplianceSeverity complianceSeverity;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
