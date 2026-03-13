package org.grantflow.repository;

import org.grantflow.entity.ReviewerAssignment;
import org.grantflow.entity.enums.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewerAssignmentRepository extends JpaRepository<ReviewerAssignment, UUID> {

    List<ReviewerAssignment> findByApplicationId(UUID applicationId);

    List<ReviewerAssignment> findByReviewerIdOrderByCreatedAtDesc(UUID reviewerId);

    long countByReviewerIdAndStatus(UUID reviewerId, ReviewStatus status);

    long countByApplicationId(UUID applicationId);

    long countByApplicationIdAndStatus(UUID applicationId, ReviewStatus status);
}
