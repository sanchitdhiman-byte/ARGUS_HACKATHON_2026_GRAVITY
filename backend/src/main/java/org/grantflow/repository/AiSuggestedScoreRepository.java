package org.grantflow.repository;

import org.grantflow.entity.AiSuggestedScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiSuggestedScoreRepository extends JpaRepository<AiSuggestedScore, UUID> {

    List<AiSuggestedScore> findByReviewPackageId(UUID reviewPackageId);
}
