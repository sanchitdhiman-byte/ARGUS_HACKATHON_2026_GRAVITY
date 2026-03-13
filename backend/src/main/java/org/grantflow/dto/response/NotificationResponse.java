package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {
    private UUID id;
    private String notificationType;
    private String title;
    private String body;
    private UUID applicationId;
    private Boolean isRead;
    private OffsetDateTime createdAt;
}
