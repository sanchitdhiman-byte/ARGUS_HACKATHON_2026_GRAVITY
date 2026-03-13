package org.grantflow.repository;

import org.grantflow.entity.ScreeningReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScreeningReportRepository extends JpaRepository<ScreeningReport, UUID> {

    Optional<ScreeningReport> findByApplicationId(UUID applicationId);
}
