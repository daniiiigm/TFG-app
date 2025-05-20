package com.gestion.infrastructure.adapter;

import com.gestion.domain.model.Record;
import com.gestion.domain.ports.out.RecordRepositoryPort;
import com.gestion.infrastructure.persistence.entities.RecordDAO;
import com.gestion.infrastructure.persistence.repositories.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RecordRepositoryAdapter implements RecordRepositoryPort {

    private final RecordRepository recordRepository;
    private final UserRepositoryAdapter userRepositoryAdapter;

    @Override
    public List<Record> getAllRecords() {
        return recordRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Record registerCheckIn(Record record) {
        RecordDAO recordDAO = toEntity(record);
        RecordDAO savedDAO = recordRepository.save(recordDAO);
        return toDomain(savedDAO);
    }

    @Override
    public Optional<Record> findOpenRecordByUserId(Long userId) {
        return recordRepository.findByUserIdAndCheckOutIsNull(userId)
                .map(this::toDomain);
    }

    @Override
    public Record registerCheckOut(Record record) {
        RecordDAO recordDAO = toEntity(record);
        RecordDAO savedDAO = recordRepository.save(recordDAO);
        return toDomain(savedDAO);
    }


    private Record toDomain(RecordDAO dao){
        return Record.builder()
                .id(dao.getId())
                .checkIn(dao.getCheckIn())
                .checkOut(dao.getCheckOut())
                .user(userRepositoryAdapter.toDomain(dao.getUser()))
                .build();
    }

    private RecordDAO toEntity(Record record) {
        return RecordDAO.builder()
                .id(record.getId())
                .checkIn(record.getCheckIn())
                .checkOut(record.getCheckOut())
                .user(userRepositoryAdapter.toEntity(record.getUser()))
                .build();
    }
}
