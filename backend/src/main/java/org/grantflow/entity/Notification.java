package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.NotificationType;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "recipient_id")
    private UUID recipientId;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type")
    private NotificationType notificationType;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "application_id")
    private UUID applicationId;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
