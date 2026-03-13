package org.grantflow.repository;

import org.grantflow.entity.AiReviewPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AiReviewPackageRepository extends JpaRepository<AiReviewPackage, UUID> {

    Optional<AiReviewPackage> findByApplicationId(UUID applicationId);
}
