package org.grantflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProgrammeResponse {
    private UUID id;
    private String code;
    private String name;
    private String purpose;
    private BigDecimal fundingMin;
    private BigDecimal fundingMax;
    private Integer durationMinMonths;
    private Integer durationMaxMonths;
    private String[] eligibleOrgTypes;
    private String geographicFocus;
    private String annualCycle;
    private Integer maxAwardsPerCycle;
    private Integer overheadCapPercent;
    private Integer reviewersRequired;

    private List<FormFieldItem> formFields;
    private List<RequiredDocItem> requiredDocuments;
    private List<EligibilityItem> eligibilityCriteria;
    private List<RubricItem> scoringRubric;
    private List<WorkflowStageItem> workflowStages;

    @Data
    @Builder
    public static class FormFieldItem {
        private UUID id;
        private String fieldName;
        private String fieldLabel;
        private String fieldType;
        private Boolean required;
        private Integer displayOrder;
        private String options;
        private String helpText;
    }

    @Data
    @Builder
    public static class RequiredDocItem {
        private UUID id;
        private String docCode;
        private String docName;
        private Boolean mandatory;
        private Integer maxSizeMb;
        private String allowedTypes;
    }

    @Data
    @Builder
    public static class EligibilityItem {
        private UUID id;
        private String criterionCode;
        private String criterionName;
        private String criterionType;
        private String ruleExpression;
        private Boolean autoCheck;
    }

    @Data
    @Builder
    public static class RubricItem {
        private UUID id;
        private String dimensionName;
        private Integer weightPercent;
        private Integer maxScore;
        private String description;
    }

    @Data
    @Builder
    public static class WorkflowStageItem {
        private UUID id;
        private Integer stageOrder;
        private String stageName;
        private String actorRole;
        private Integer slaHours;
        private Boolean autoTransition;
    }
}
