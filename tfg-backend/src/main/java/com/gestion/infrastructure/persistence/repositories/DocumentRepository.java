package com.gestion.infrastructure.persistence.repositories;

import com.gestion.infrastructure.persistence.entities.DocumentDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentDAO, Long> {
    List<DocumentDAO> findByUserId(Long userId);
}