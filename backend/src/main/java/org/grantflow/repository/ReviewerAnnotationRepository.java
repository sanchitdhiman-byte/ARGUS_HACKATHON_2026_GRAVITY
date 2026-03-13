package org.grantflow.repository;

import org.grantflow.entity.ReviewerAnnotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewerAnnotationRepository extends JpaRepository<ReviewerAnnotation, UUID> {

    List<ReviewerAnnotation> findByAssignmentId(UUID assignmentId);
}
