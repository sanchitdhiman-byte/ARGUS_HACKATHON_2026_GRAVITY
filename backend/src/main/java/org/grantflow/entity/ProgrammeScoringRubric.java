package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "programme_scoring_rubric")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeScoringRubric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "programme_id")
    private UUID programmeId;

    @Column(name = "dimension_name")
    private String dimensionName;

    @Column(name = "weight_percent")
    private Integer weightPercent;

    @Column(name = "score_5_description")
    private String score5Description;

    @Column(name = "score_1_description")
    private String score1Description;

    @Column(name = "display_order")
    private Integer displayOrder;
}
