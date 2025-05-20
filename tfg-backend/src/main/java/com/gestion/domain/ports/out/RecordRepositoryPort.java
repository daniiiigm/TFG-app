package com.gestion.domain.ports.out;

import com.gestion.domain.model.Record;
import com.gestion.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface RecordRepositoryPort {
    List<Record> getAllRecords();
    Record registerCheckIn(Record record);
    Optional<Record> findOpenRecordByUserId(Long userId);
    Record registerCheckOut(Record record);
}
