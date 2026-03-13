package org.grantflow.repository;

import org.grantflow.entity.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrganisationRepository extends JpaRepository<Organisation, UUID> {

    List<Organisation> findByCreatedBy(UUID createdBy);

    Optional<Organisation> findByRegistrationNumber(String registrationNumber);
}
