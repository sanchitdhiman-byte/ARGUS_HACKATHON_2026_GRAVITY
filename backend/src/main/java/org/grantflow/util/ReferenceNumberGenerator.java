package org.grantflow.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class ReferenceNumberGenerator {

    public String generateApplicationReference(String programmeCode) {
        String datePart = LocalDate.now().toString().replace("-", "");
        String uniquePart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return programmeCode + "-" + datePart + "-" + uniquePart;
    }

    public String generateGrantReference(String programmeCode) {
        String datePart = LocalDate.now().toString().replace("-", "");
        String uniquePart = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "GR-" + programmeCode + "-" + datePart + "-" + uniquePart;
    }
}
