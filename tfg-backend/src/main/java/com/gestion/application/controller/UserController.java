package com.gestion.application.controller;

import com.gestion.application.model.UpdateUserDTO;
import com.gestion.application.model.UserRequestDTO;
import com.gestion.domain.model.User;
import com.gestion.domain.model.enums.Role;
import com.gestion.domain.ports.in.UserUseCase;
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
@RequestMapping(path = "api/users")
public class UserController {

    private final UserUseCase userUseCase;

    @Operation(summary = "Endpoint to get all Users")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(value = "/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userUseCase.getAllUsers();

        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Endpoint to get a user by id")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(value = "/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        try {
            User user = userUseCase.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @Operation(summary = "Endpoint to create a new user")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(value = "/create")
    public ResponseEntity<User> createUser(@RequestBody UserRequestDTO userRequest) {
        User savedUser = userUseCase.createUser(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @Operation(summary = "Endpoint to delete a user by id")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable Long id) {
        User deletedUser = userUseCase.deleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(deletedUser);
    }

    @Operation(summary = "Endpoint to update an existing user")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO updatedUser) {
        User user = userUseCase.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Endpoint to update the rol of an existing user")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/update-rol/{id}")
    public ResponseEntity<User> updateUserRol(@PathVariable Long id, @RequestBody Role role) {
        User user = userUseCase.updateUserRol(id, role);
        return ResponseEntity.ok(user);
    }


}
