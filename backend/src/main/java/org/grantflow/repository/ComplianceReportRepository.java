package org.grantflow.repository;

import org.grantflow.entity.ComplianceReport;
import org.grantflow.entity.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ComplianceReportRepository extends JpaRepository<ComplianceReport, UUID> {

    List<ComplianceReport> findByAgreementIdOrderByReportNumberAsc(UUID agreementId);

    List<ComplianceReport> findByStatusOrderByDueDateAsc(ReportStatus status);
}
