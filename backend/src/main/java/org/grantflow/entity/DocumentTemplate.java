package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "template_name", unique = true)
    private String templateName;

    @Column(name = "template_body", columnDefinition = "TEXT")
    private String templateBody;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "merge_fields", columnDefinition = "text[]")
    private String[] mergeFields;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
