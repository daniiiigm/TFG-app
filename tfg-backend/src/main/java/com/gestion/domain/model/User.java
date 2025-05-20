package com.gestion.domain.model;

import com.gestion.domain.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private Role role;
    private LocalDate creationDate;

}
