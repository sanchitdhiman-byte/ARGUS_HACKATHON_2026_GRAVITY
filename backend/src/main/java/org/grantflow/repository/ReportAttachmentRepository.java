package org.grantflow.repository;

import org.grantflow.entity.ReportAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReportAttachmentRepository extends JpaRepository<ReportAttachment, UUID> {

    List<ReportAttachment> findByReportId(UUID reportId);
}
