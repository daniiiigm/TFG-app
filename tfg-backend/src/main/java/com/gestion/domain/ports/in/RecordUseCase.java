package com.gestion.domain.ports.in;

import com.gestion.application.model.RecordDTO;
import com.gestion.domain.model.Record;
import com.gestion.domain.model.User;

import java.util.List;

public interface RecordUseCase {
    List<Record> getAllRecords();
    Record getRecordById(Long id);
    Record registerCheckIn(Long userId);
    Record registerCheckOut(Long userId);
    List<Record> getRecordsByUserId(Long userId);
    Record updateRecord(Long id, RecordDTO recordDTO);
}
