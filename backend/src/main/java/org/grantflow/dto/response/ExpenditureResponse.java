package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ExpenditureResponse {
    private UUID id;
    private UUID agreementId;
    private LocalDate expenseDate;
    private String description;
    private String payee;
    private BigDecimal amount;
    private String budgetCategory;
    private String receiptPath;
    private String status;
    private UUID verifiedBy;
    private OffsetDateTime createdAt;
}
