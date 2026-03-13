package org.grantflow.repository;

import org.grantflow.entity.ProgrammeWorkflowStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProgrammeWorkflowStageRepository extends JpaRepository<ProgrammeWorkflowStage, UUID> {

    List<ProgrammeWorkflowStage> findByProgrammeIdOrderByStageNumberAsc(UUID programmeId);

    Optional<ProgrammeWorkflowStage> findByProgrammeIdAndStageNumber(UUID programmeId, Integer stageNumber);
}
