package org.grantflow.repository;

import org.grantflow.entity.DisbursementTranche;
import org.grantflow.entity.enums.TrancheStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface DisbursementTrancheRepository extends JpaRepository<DisbursementTranche, UUID> {

    List<DisbursementTranche> findByAgreementIdOrderByCreatedAtAsc(UUID agreementId);

    @Query("SELECT COALESCE(SUM(dt.amount), 0) FROM DisbursementTranche dt WHERE dt.status = :status")
    BigDecimal sumAmountByStatus(TrancheStatus status);
}
