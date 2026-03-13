package org.grantflow.util;

import lombok.RequiredArgsConstructor;
import org.grantflow.entity.AuditLog;
import org.grantflow.repository.AuditLogRepository;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditLogger {

    private final AuditLogRepository auditLogRepository;

    public void log(UUID actorId, String actorEmail, String action, String objectType, UUID objectId, Map<String, Object> details) {
        AuditLog auditLog = AuditLog.builder()
                .actorId(actorId)
                .actorEmail(actorEmail)
                .action(action)
                .objectType(objectType)
                .objectId(objectId)
                .details(details)
                .createdAt(OffsetDateTime.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    public void log(UUID actorId, String action, String objectType, UUID objectId) {
        log(actorId, null, action, objectType, objectId, null);
    }
}
