package com.gestion.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Record {
    private Long id;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private User user;
}
