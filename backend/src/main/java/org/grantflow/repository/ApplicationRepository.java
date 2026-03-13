package org.grantflow.repository;

import org.grantflow.entity.Application;
import org.grantflow.entity.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByApplicantIdOrderByCreatedAtDesc(UUID applicantId);

    List<Application> findByProgrammeIdOrderByCreatedAtDesc(UUID programmeId);

    List<Application> findByStatusOrderByCreatedAtDesc(ApplicationStatus status);

    List<Application> findAllByOrderByCreatedAtDesc();

    long countByStatus(ApplicationStatus status);

    long countByApplicantId(UUID applicantId);

    long countByApplicantIdAndStatus(UUID applicantId, ApplicationStatus status);

    long countByProgrammeId(UUID programmeId);
}
