package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "programme_required_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeRequiredDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "programme_id")
    private UUID programmeId;

    @Column(name = "document_name")
    private String documentName;

    private String description;

    @Column(name = "is_mandatory")
    private Boolean isMandatory;

    @Column(name = "display_order")
    private Integer displayOrder;
}
