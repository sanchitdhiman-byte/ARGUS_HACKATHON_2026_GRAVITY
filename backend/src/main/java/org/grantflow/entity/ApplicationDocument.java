package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.DocumentSource;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "application_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id")
    private UUID applicationId;

    @Column(name = "required_document_id")
    private UUID requiredDocumentId;

    @Column(name = "vault_document_id")
    private UUID vaultDocumentId;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Enumerated(EnumType.STRING)
    private DocumentSource source;

    @Column(name = "uploaded_by")
    private UUID uploadedBy;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
}
