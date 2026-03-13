package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "grant_agreements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrantAgreement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id", unique = true)
    private UUID applicationId;

    @Column(name = "grant_reference", unique = true)
    private String grantReference;

    @Column(name = "agreement_date")
    private LocalDate agreementDate;

    @Column(name = "award_amount")
    private BigDecimal awardAmount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "reporting_schedule", columnDefinition = "TEXT")
    private String reportingSchedule;

    @Column(name = "special_conditions", columnDefinition = "TEXT")
    private String specialConditions;

    @Column(name = "agreement_pdf_path")
    private String agreementPdfPath;

    @Column(name = "sent_at")
    private OffsetDateTime sentAt;

    @Column(name = "acknowledged_at")
    private OffsetDateTime acknowledgedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
