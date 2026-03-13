package org.grantflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.grantflow.entity.enums.UserRole;
import org.grantflow.entity.enums.UserStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "email_verified")
    private Boolean emailVerified;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_expires_at")
    private OffsetDateTime otpExpiresAt;

    @Column(name = "organisation_id")
    private UUID organisationId;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
