package org.grantflow.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ApplicationCreateRequest {
    @NotNull
    private UUID programmeId;
}
