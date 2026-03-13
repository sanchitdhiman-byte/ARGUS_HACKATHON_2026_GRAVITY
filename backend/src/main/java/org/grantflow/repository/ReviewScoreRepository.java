package org.grantflow.repository;

import org.grantflow.entity.ReviewScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewScoreRepository extends JpaRepository<ReviewScore, UUID> {

    List<ReviewScore> findByAssignmentId(UUID assignmentId);

    Optional<ReviewScore> findByAssignmentIdAndRubricDimensionId(UUID assignmentId, UUID rubricDimensionId);
}
