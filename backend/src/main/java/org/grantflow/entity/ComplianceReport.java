package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.ReportStatus;
import org.grantflow.entity.enums.ReportType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "compliance_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "agreement_id")
    private UUID agreementId;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type")
    private ReportType reportType;

    @Column(name = "report_number")
    private Integer reportNumber;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "report_data", columnDefinition = "jsonb")
    private Map<String, Object> reportData;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
