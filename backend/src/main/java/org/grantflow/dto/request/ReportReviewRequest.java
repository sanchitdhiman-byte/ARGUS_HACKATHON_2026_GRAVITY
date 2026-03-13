package org.grantflow.dto.request;

import lombok.Data;

@Data
public class ReportReviewRequest {
    private String action;
    private String complianceSeverity;
    private String comments;
}
