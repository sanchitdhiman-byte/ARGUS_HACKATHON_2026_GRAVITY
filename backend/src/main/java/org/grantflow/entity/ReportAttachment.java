package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "report_attachments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "report_id")
    private UUID reportId;

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
}
