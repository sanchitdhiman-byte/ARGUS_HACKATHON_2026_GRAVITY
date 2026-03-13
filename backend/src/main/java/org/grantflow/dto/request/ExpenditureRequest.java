package org.grantflow.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenditureRequest {
    private LocalDate expenseDate;
    private String description;
    private String payee;
    private BigDecimal amount;
    private String budgetCategory;
    private String receiptPath;
}
