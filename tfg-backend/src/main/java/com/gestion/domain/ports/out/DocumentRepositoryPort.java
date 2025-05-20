package com.gestion.domain.ports.out;

import com.gestion.domain.model.Document;

import java.util.List;

public interface DocumentRepositoryPort {
    List<Document> getAllDocuments();
}
