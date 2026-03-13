package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "programme_eligibility_criteria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeEligibilityCriteria {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "programme_id")
    private UUID programmeId;

    @Column(name = "criterion_code")
    private String criterionCode;

    @Column(name = "criterion_name")
    private String criterionName;

    @Column(name = "rule_description")
    private String ruleDescription;

    @Column(name = "is_hard_rule")
    private Boolean isHardRule;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "evaluation_logic", columnDefinition = "jsonb")
    private Map<String, Object> evaluationLogic;
}
