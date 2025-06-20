package com.gestion.infrastructure.persistence.repositories;

import com.gestion.infrastructure.persistence.entities.UserDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserDAO, Long> {
    Optional<UserDAO> findByEmail(String email);
}
