package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "programme_form_fields")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeFormField {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "programme_id")
    private UUID programmeId;

    private String section;

    @Column(name = "field_key")
    private String fieldKey;

    @Column(name = "field_label")
    private String fieldLabel;

    @Column(name = "field_type")
    private String fieldType;

    @Column(name = "is_required")
    private Boolean isRequired;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> options;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "validation_rules", columnDefinition = "jsonb")
    private Map<String, Object> validationRules;

    @Column(name = "display_order")
    private Integer displayOrder;
}
