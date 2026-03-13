package org.grantflow.repository;

import org.grantflow.entity.ProgrammeScoringRubric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProgrammeScoringRubricRepository extends JpaRepository<ProgrammeScoringRubric, UUID> {

    List<ProgrammeScoringRubric> findByProgrammeIdOrderByDisplayOrderAsc(UUID programmeId);
}
