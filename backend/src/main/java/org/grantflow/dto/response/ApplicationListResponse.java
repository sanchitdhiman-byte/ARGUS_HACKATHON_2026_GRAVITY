package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class ApplicationListResponse {
    private UUID id;
    private String referenceNumber;
    private String status;
    private Integer currentStage;
    private UUID programmeId;
    private String programmeName;
    private String programmeCode;
    private String applicantName;
    private String organisationName;
    private OffsetDateTime submittedAt;
    private OffsetDateTime createdAt;
}
