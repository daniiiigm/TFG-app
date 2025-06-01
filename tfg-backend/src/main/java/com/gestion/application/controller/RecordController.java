package com.gestion.application.controller;

import com.gestion.application.model.RecordDTO;
import com.gestion.domain.model.Record;
import com.gestion.domain.model.User;
import com.gestion.domain.ports.in.RecordUseCase;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/records")
public class RecordController {

    private final RecordUseCase recordUseCase;

    @Operation(summary = "Endpoint to get all records")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(value = "/all")
    public ResponseEntity<List<Record>> getAllRecords() {
        List<Record> records = recordUseCase.getAllRecords();

        return ResponseEntity.ok(records);
    }

    @Operation(summary = "Endpoint to get a record by id")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(value = "/{id}")
    public ResponseEntity<Record> getRecord(@PathVariable Long id) {
        try {
            Record record = recordUseCase.getRecordById(id);
            return ResponseEntity.ok(record);
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @Operation(summary = "Register check-in time")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/check-in/{userId}")
    public ResponseEntity<Record> registerCheckIn(@PathVariable Long userId) {
        Record record = recordUseCase.registerCheckIn(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(record);
    }

    @Operation(summary = "Register check-out time")
    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/check-out/{userId}")
    public ResponseEntity<Record> registerCheckOut(@PathVariable Long userId) {
        Record record = recordUseCase.registerCheckOut(userId);
        return ResponseEntity.ok(record);
    }

    @Operation(summary = "Endpoint to get all records from one user")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/all-records/{userId}")
    public ResponseEntity<List<Record>> getAllRecordsByUser(@PathVariable Long userId) {
        List<Record> records = recordUseCase.getRecordsByUserId(userId);
        return ResponseEntity.ok(records);
    }

    @Operation(summary = "Endpoint to update a record")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/update/{id}")
    public ResponseEntity<Record> UpdateRecord(@PathVariable Long id, @RequestBody RecordDTO recordDTO) {
        Record record = recordUseCase.updateRecord(id, recordDTO);
        return ResponseEntity.ok(record);
    }

}
