package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BankDetailResponse {
    private UUID id;
    private UUID agreementId;
    private String accountNumberMasked;
    private String ifscCode;
    private String beneficiaryName;
    private String bankName;
    private String branchName;
}
