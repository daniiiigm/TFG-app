package com.gestion.application.config;

import com.gestion.domain.ports.in.RecordUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {
    private final RecordUseCase recordUseCase;

    @Scheduled(cron = "0 0 12 ? * MON-FRI")
    public void checkInactiveUsersDaily() {
        recordUseCase.notifyInactiveUsers();
    }
}
