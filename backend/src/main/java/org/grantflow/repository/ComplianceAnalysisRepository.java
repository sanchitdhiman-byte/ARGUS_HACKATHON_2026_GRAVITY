package org.grantflow.repository;

import org.grantflow.entity.ComplianceAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplianceAnalysisRepository extends JpaRepository<ComplianceAnalysis, UUID> {

    Optional<ComplianceAnalysis> findByReportId(UUID reportId);
}
