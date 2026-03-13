package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.TrancheStatus;
import org.grantflow.entity.enums.TrancheType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "disbursement_tranches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisbursementTranche {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "agreement_id")
    private UUID agreementId;

    @Column(name = "tranche_label")
    private String trancheLabel;

    @Enumerated(EnumType.STRING)
    @Column(name = "tranche_type")
    private TrancheType trancheType;

    private BigDecimal amount;

    @Column(name = "trigger_condition", columnDefinition = "TEXT")
    private String triggerCondition;

    @Enumerated(EnumType.STRING)
    private TrancheStatus status;

    @Column(name = "linked_report_id")
    private UUID linkedReportId;

    @Column(name = "payment_reference")
    private String paymentReference;

    @Column(name = "processed_at")
    private OffsetDateTime processedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
