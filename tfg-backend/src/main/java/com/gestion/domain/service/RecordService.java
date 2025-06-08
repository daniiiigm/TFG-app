package com.gestion.domain.service;

import com.gestion.application.model.UpdateRecordDTO;
import com.gestion.domain.exceptions.CheckInAlreadyDoneException;
import com.gestion.domain.exceptions.CheckOutAlreadyDoneException;
import com.gestion.domain.exceptions.RecordNotFoundException;
import com.gestion.domain.exceptions.UserNotFoundException;
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

    @Override
    public Record getRecordById(Long id) {
        return recordRepositoryPort.getUserById(id)
                .orElseThrow(() -> new RecordNotFoundException(id));
    }

    @Transactional
    @Override
    public Record registerCheckIn(Long userId) {
        User user = userRepositoryPort.getUserById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // Verificar si ya existe un registro sin check-out
        recordRepositoryPort.findOpenRecordByUserId(userId).ifPresent(record -> {
            throw new CheckInAlreadyDoneException(userId);
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
                .orElseThrow(() -> new UserNotFoundException(userId));

        Record record = recordRepositoryPort.findOpenRecordByUserId(userId)
                .orElseThrow(() -> new RecordNotFoundException("Record not found for user with ID " + userId));

        if (record.getCheckOut() != null) {
            throw new CheckOutAlreadyDoneException(userId);
        }

        record.setCheckOut(LocalDateTime.now());
        return recordRepositoryPort.registerCheckOut(record);
    }

    @Override
    public List<Record> getRecordsByUserId(Long userId) {
        return recordRepositoryPort.getRecordsByUserId(userId);
    }

    @Override
    public Record updateRecord(Long id, UpdateRecordDTO updateRecordDTO) {
        Record record = getRecordById(id);
        record.setCheckIn(updateRecordDTO.getCheckIn());
        record.setCheckOut(updateRecordDTO.getCheckOut());
        return recordRepositoryPort.updateRecord(id,record);
    }
}
