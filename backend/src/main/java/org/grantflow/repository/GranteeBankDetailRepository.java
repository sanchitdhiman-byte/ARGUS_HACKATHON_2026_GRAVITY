package org.grantflow.repository;

import org.grantflow.entity.GranteeBankDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GranteeBankDetailRepository extends JpaRepository<GranteeBankDetail, UUID> {

    Optional<GranteeBankDetail> findByAgreementId(UUID agreementId);
}
