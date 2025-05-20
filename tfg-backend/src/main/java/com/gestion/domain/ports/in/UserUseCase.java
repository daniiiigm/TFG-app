package com.gestion.domain.ports.in;

import com.gestion.application.model.AuthRequestDTO;
import com.gestion.application.model.LoginResponseDTO;
import com.gestion.application.model.UpdateUserDTO;
import com.gestion.application.model.UserRequestDTO;
import com.gestion.domain.model.User;
import com.gestion.domain.model.enums.Role;

import java.util.List;

public interface UserUseCase {

    List<User> getAllUsers();
    User getUserById(Long id);
    User createUser(UserRequestDTO user);
    User deleteUser(Long id);
    User updateUser(Long id, UpdateUserDTO user);
    User updateUserRol(Long id, Role role);
    LoginResponseDTO login(AuthRequestDTO user);
}
