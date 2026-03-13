package org.grantflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BankDetailRequest {
    @NotBlank
    private String accountNumber;

    @NotBlank
    private String ifscCode;

    @NotBlank
    private String beneficiaryName;

    @NotBlank
    private String bankName;

    @NotBlank
    private String branchName;
}
