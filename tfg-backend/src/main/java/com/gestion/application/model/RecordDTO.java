package com.gestion.application.model;

import com.gestion.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecordDTO {
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
}
