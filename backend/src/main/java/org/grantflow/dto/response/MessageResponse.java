package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class MessageResponse {
    private UUID id;
    private UUID applicationId;
    private UUID senderId;
    private String senderName;
    private String senderEmail;
    private String visibility;
    private String subject;
    private String body;
    private UUID parentMessageId;
    private OffsetDateTime createdAt;
}
