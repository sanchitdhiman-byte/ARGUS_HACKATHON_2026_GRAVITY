package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class AuditLogResponse {
    private UUID id;
    private UUID actorId;
    private String actorEmail;
    private String action;
    private String objectType;
    private UUID objectId;
    private Map<String, Object> details;
    private OffsetDateTime createdAt;
}
