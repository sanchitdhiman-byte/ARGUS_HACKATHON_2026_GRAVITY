package org.grantflow.repository;

import org.grantflow.entity.ProgrammeFormField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProgrammeFormFieldRepository extends JpaRepository<ProgrammeFormField, UUID> {

    List<ProgrammeFormField> findByProgrammeIdOrderByDisplayOrderAsc(UUID programmeId);
}
