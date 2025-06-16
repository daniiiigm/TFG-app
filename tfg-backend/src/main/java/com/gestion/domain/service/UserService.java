package com.gestion.domain.service;

import com.gestion.application.config.JwtUtil;
import com.gestion.application.config.PasswordEncoderUtil;
import com.gestion.application.model.*;
import com.gestion.domain.exceptions.UserNotFoundException;
import com.gestion.domain.exceptions.WrongPasswordException;
import com.gestion.domain.model.User;
import com.gestion.domain.model.enums.Role;
import com.gestion.domain.ports.in.UserUseCase;
import com.gestion.domain.ports.out.UserRepositoryPort;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserUseCase{

    private final UserRepositoryPort userRepositoryPort;
    private final JwtUtil jwtUtil;

    @Override
    public List<User> getAllUsers() {
        return userRepositoryPort.getAllUsers();
    }

    @Override
    public User getUserById(Long id) {

        return userRepositoryPort.getUserById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    @Override
    public User createUser(UserRequestDTO userRequest) {
        String encodedPassword = PasswordEncoderUtil.encodePassword(userRequest.getName());
        User user = User.builder()
                .name(userRequest.getName())
                .surname(userRequest.getSurname())
                .email(userRequest.getEmail())
                .password(encodedPassword)
                .role(userRequest.getRole())
                .creationDate(LocalDate.now())
                .build();

        return userRepositoryPort.createUser(user);
    }

    @Transactional
    @Override
    public User deleteUser(Long id) {
        User user = userRepositoryPort.getUserById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        userRepositoryPort.deleteUser(id);
        return user;
    }

    @Override
    public User updateUser(Long id, UpdateUserDTO updatedUser) {
        User user = getUserById(id);
        user.setName(updatedUser.getName());
        user.setSurname(updatedUser.getSurname());
        user.setEmail(updatedUser.getEmail());
        return userRepositoryPort.updateUser(id,user);
    }

    @Override
    public User updateUserRol(Long id, Role role) {
        User user = getUserById(id);
        user.setRole(role);
        return userRepositoryPort.updateUserRol(id,user);
    }

    @Override
    public LoginResponseDTO login(AuthRequestDTO authRequest) {
        Optional<User> userOptional = userRepositoryPort.findByEmail(authRequest.getEmail());

        if (userOptional.isPresent()){
            User user = userOptional.get();
            if (PasswordEncoderUtil.matchesPassword( authRequest.getPassword(), user.getPassword())){
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
                return  new LoginResponseDTO(token, user.getRole().name(), user.getId());
            }
            throw  new WrongPasswordException(user.getId());
        }

        throw new UserNotFoundException("User not found");
    }

    @Override
    public User selfUpdateUser(Long id, SelfUpdateDTO selfUpdateDTO) {
        User user = getUserById(id);
        user.setName(selfUpdateDTO.getName());
        user.setSurname(selfUpdateDTO.getSurname());
        user.setPassword(PasswordEncoderUtil.encodePassword(selfUpdateDTO.getPassword()));
        return userRepositoryPort.selfUpdateUser(id,user);
    }
}

