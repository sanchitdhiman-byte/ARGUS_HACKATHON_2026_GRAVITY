package org.grantflow.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class ComplianceReportSubmitRequest {
    private Map<String, Object> reportData;
}
