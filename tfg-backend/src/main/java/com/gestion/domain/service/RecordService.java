package com.gestion.domain.service;

import com.gestion.domain.model.Record;
import com.gestion.domain.model.User;
import com.gestion.domain.ports.in.RecordUseCase;
import com.gestion.domain.ports.out.RecordRepositoryPort;
import com.gestion.domain.ports.out.UserRepositoryPort;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordService implements RecordUseCase {
    private final RecordRepositoryPort recordRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;
    @Override
    public List<Record> getAllRecords() {
        return recordRepositoryPort.getAllRecords();
    }

    @Transactional
    @Override
    public Record registerCheckIn(Long userId) {
        User user = userRepositoryPort.getUserById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + userId));

        // Verificar si ya existe un registro sin check-out
        recordRepositoryPort.findOpenRecordByUserId(userId).ifPresent(record -> {
            throw new IllegalStateException("User already has done check-in");
        });

        Record newRecord = Record.builder()
                .checkIn(LocalDateTime.now())
                .user(user)
                .build();

        return recordRepositoryPort.registerCheckIn(newRecord);
    }

    @Transactional
    @Override
    public Record registerCheckOut(Long userId) {
        User user = userRepositoryPort.getUserById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + userId));

        Record record = recordRepositoryPort.findOpenRecordByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + userId));

        if (record.getCheckOut() != null) {
            throw new IllegalStateException("Record already has check-out time");
        }

        record.setCheckOut(LocalDateTime.now());
        return recordRepositoryPort.registerCheckOut(record);
    }
}
