package com.gestion.domain.ports.out;

import com.gestion.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepositoryPort {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);

    User createUser(User user);
    void deleteUser(Long id);
    User updateUser(Long id, User user);
    User updateUserRol(Long id, User user);
    Optional<User> findByEmail(String email);
}
