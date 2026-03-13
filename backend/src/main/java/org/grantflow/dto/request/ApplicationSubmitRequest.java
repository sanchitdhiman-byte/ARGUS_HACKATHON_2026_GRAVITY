package org.grantflow.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class ApplicationSubmitRequest {
    private Map<String, Object> formData;

    private String note;
}
