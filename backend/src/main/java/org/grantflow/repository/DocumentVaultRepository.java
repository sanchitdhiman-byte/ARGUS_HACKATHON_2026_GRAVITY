package org.grantflow.repository;

import org.grantflow.entity.DocumentVault;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentVaultRepository extends JpaRepository<DocumentVault, UUID> {

    List<DocumentVault> findByOrganisationId(UUID organisationId);
}
