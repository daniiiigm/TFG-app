package com.gestion.application.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNameSurnameDTO {
    private String name;
    private String surname;
    private String password;
}
