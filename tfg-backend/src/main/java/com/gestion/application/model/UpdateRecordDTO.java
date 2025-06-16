package com.gestion.application.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRecordDTO {
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
}
