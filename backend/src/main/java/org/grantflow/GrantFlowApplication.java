package org.grantflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GrantFlowApplication {
    public static void main(String[] args) {
        SpringApplication.run(GrantFlowApplication.class, args);
    }
}
