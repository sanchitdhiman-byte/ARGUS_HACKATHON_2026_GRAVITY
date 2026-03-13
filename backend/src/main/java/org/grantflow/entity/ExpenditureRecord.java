package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.ExpenditureStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "expenditure_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenditureRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "agreement_id")
    private UUID agreementId;

    @Column(name = "expense_date")
    private LocalDate expenseDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String payee;

    private BigDecimal amount;

    @Column(name = "budget_category")
    private String budgetCategory;

    @Column(name = "receipt_path")
    private String receiptPath;

    @Enumerated(EnumType.STRING)
    private ExpenditureStatus status;

    @Column(name = "verified_by")
    private UUID verifiedBy;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
