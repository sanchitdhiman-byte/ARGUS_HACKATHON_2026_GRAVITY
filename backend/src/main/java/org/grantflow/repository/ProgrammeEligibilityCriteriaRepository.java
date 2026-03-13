package org.grantflow.repository;

import org.grantflow.entity.ProgrammeEligibilityCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProgrammeEligibilityCriteriaRepository extends JpaRepository<ProgrammeEligibilityCriteria, UUID> {

    List<ProgrammeEligibilityCriteria> findByProgrammeId(UUID programmeId);
}
