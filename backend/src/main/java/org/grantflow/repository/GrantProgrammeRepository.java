package org.grantflow.repository;

import org.grantflow.entity.GrantProgramme;
import org.grantflow.entity.enums.GrantTypeCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GrantProgrammeRepository extends JpaRepository<GrantProgramme, UUID> {

    Optional<GrantProgramme> findByCode(GrantTypeCode code);
}
