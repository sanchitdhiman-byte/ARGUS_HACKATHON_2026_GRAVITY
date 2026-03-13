package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private Map<String, Long> statusCounts;
    private long totalApplications;
    private long totalProgrammes;
    private long totalUsers;
    private BigDecimal totalDisbursed;
    private List<ApplicationListResponse> recentApplications;
    private long pendingReviews;
    private long completedReviews;
}
