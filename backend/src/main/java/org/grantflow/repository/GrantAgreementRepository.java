package org.grantflow.repository;

import org.grantflow.entity.GrantAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GrantAgreementRepository extends JpaRepository<GrantAgreement, UUID> {

    Optional<GrantAgreement> findByApplicationId(UUID applicationId);
}
