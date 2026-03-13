package org.grantflow.repository;

import org.grantflow.entity.ScreeningCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScreeningCheckRepository extends JpaRepository<ScreeningCheck, UUID> {

    List<ScreeningCheck> findByScreeningReportId(UUID screeningReportId);
}
