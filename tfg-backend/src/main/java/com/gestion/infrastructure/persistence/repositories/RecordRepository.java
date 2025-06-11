package com.gestion.infrastructure.persistence.repositories;

import com.gestion.infrastructure.persistence.entities.RecordDAO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecordRepository extends JpaRepository<RecordDAO, Long> {
    Optional<RecordDAO> findByUserIdAndCheckOutIsNull(Long userId);
    List<RecordDAO> findByUserId(Long userId);
    Optional<RecordDAO> findTopByUserIdOrderByCheckInDesc(Long userId);
}
