package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_vault")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentVault {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "organisation_id")
    private UUID organisationId;

    @Column(name = "uploaded_by")
    private UUID uploadedBy;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
