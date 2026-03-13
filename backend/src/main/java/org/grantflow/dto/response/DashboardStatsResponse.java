package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalApplications;
    private long pendingReview;
    private long approved;
    private long rejected;
    private long activeGrants;
    private BigDecimal totalDisbursed;
    private List<ApplicationListResponse> recentApplications;
}
