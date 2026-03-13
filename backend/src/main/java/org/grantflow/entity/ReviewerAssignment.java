package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.ReviewStatus;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviewer_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id")
    private UUID applicationId;

    @Column(name = "reviewer_id")
    private UUID reviewerId;

    @Column(name = "assigned_by")
    private UUID assignedBy;

    @Enumerated(EnumType.STRING)
    private ReviewStatus status;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
