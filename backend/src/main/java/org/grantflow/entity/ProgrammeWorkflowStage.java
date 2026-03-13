package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "programme_workflow_stages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeWorkflowStage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "programme_id")
    private UUID programmeId;

    @Column(name = "stage_number")
    private Integer stageNumber;

    @Column(name = "stage_name")
    private String stageName;

    @Column(name = "who_acts")
    private String whoActs;

    @Column(name = "sla_days")
    private Integer slaDays;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "status_labels", columnDefinition = "text[]")
    private String[] statusLabels;
}
