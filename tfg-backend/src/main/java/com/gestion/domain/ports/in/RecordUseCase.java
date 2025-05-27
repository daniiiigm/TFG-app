package com.gestion.domain.ports.in;

import com.gestion.domain.model.Record;
import com.gestion.domain.model.User;

import java.util.List;

public interface RecordUseCase {
    List<Record> getAllRecords();
    Record registerCheckIn(Long userId);
    Record registerCheckOut(Long userId);
    List<Record> getRecordsByUserId(Long userId);
}
