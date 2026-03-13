package org.grantflow.repository;

import org.grantflow.entity.AwardDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AwardDecisionRepository extends JpaRepository<AwardDecision, UUID> {

    Optional<AwardDecision> findByApplicationId(UUID applicationId);

    @Query("SELECT ad FROM AwardDecision ad JOIN Application a ON ad.applicationId = a.id WHERE a.programmeId = :programmeId ORDER BY ad.createdAt DESC")
    List<AwardDecision> findByProgrammeId(UUID programmeId);
}
