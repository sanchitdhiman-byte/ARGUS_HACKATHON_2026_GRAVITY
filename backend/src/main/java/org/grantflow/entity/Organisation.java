package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.OrgType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "organisations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organisation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "legal_name")
    private String legalName;

    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "org_type")
    private OrgType orgType;

    @Column(name = "year_established")
    private Integer yearEstablished;

    private String district;

    private String state;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    private String website;

    @Column(name = "annual_operating_budget")
    private BigDecimal annualOperatingBudget;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
