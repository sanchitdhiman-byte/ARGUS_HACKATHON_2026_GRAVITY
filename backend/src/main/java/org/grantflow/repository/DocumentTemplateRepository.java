package org.grantflow.repository;

import org.grantflow.entity.DocumentTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentTemplateRepository extends JpaRepository<DocumentTemplate, UUID> {

    Optional<DocumentTemplate> findByTemplateName(String templateName);
}
