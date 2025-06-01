package com.gestion.domain.ports.out;

import com.gestion.domain.model.Document;

import java.util.List;
import java.util.Optional;

public interface DocumentRepositoryPort {
    List<Document> getAllDocuments();
    Optional<Document> getDocumentById(Long id);
    Document uploadDocument(Document document);
    void deleteDocument(Long id);
    List<Document> getDocumentsByUserId(Long userId);
}
