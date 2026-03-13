package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.MessageVisibility;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id")
    private UUID applicationId;

    @Column(name = "sender_id")
    private UUID senderId;

    @Enumerated(EnumType.STRING)
    private MessageVisibility visibility;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "parent_message_id")
    private UUID parentMessageId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
