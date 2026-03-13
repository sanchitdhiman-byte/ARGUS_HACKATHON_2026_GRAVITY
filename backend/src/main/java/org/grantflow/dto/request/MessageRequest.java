package org.grantflow.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class MessageRequest {
    private String subject;
    private String body;
    private String visibility;
    private UUID parentMessageId;
}
