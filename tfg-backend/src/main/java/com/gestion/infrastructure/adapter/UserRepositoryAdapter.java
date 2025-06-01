package com.gestion.infrastructure.adapter;

import com.gestion.domain.model.User;
import com.gestion.domain.ports.out.UserRepositoryPort;
import com.gestion.infrastructure.persistence.entities.UserDAO;
import com.gestion.infrastructure.persistence.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {
    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id).map(this::toDomain);
    }

    @Override
    public User createUser(User user) {
        UserDAO userDAO = toEntity(user);
        UserDAO savedDao = userRepository.save(userDAO);
        return toDomain(savedDao);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User updateUser(Long id, User user) {
        UserDAO userDAO = toEntity(user);
        UserDAO updatedDAO = userRepository.save(userDAO);
        return toDomain(updatedDAO);
    }

    @Override
    public User updateUserRol(Long id, User user) {
        UserDAO userDAO = toEntity(user);
        UserDAO updatedDAO = userRepository.save(userDAO);
        return toDomain(updatedDAO);
    }

    @Override
    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public User selfUpdateUser(Long id, User user) {
        UserDAO userDAO = toEntity(user);
        UserDAO updatedDAO = userRepository.save(userDAO);
        return toDomain(updatedDAO);
    }


    public User toDomain(UserDAO dao){
        return User.builder()
                .id(dao.getId())
                .name(dao.getName())
                .surname(dao.getSurname())
                .email(dao.getEmail())
                .password(dao.getPassword())
                .role(dao.getRole())
                .creationDate(dao.getCreationDate())
                .build();
    }

    public UserDAO toEntity(User user) {
        return UserDAO.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .creationDate(user.getCreationDate())
                .build();
    }

}
