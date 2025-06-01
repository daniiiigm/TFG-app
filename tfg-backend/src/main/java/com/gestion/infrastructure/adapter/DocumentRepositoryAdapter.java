package com.gestion.infrastructure.adapter;

import com.gestion.domain.model.Document;
import com.gestion.domain.model.Record;
import com.gestion.domain.ports.out.DocumentRepositoryPort;
import com.gestion.infrastructure.persistence.entities.DocumentDAO;
import com.gestion.infrastructure.persistence.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DocumentRepositoryAdapter implements DocumentRepositoryPort {

    private final DocumentRepository documentRepository;
    private final UserRepositoryAdapter userRepositoryAdapter;

    @Override
    public List<Document> getAllDocuments() {
        return documentRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Document uploadDocument(Document document) {
        DocumentDAO documentDAO = toEntity(document);
        DocumentDAO savedDAO = documentRepository.save(documentDAO);
        return toDomain(savedDAO);
    }

    @Override
    public void deleteDocument(Long id) { documentRepository.deleteById(id); }

    @Override
    public List<Document> getDocumentsByUserId(Long userId) {
        List<Document> documents = documentRepository.findByUserId(userId).stream().map(this::toDomain).toList();
        return documents;
    }

    private Document toDomain(DocumentDAO dao){
        return Document.builder()
                .id(dao.getId())
                .name(dao.getName())
                .archive(dao.getArchive())
                .loadDate(dao.getLoadDate())
                .user(userRepositoryAdapter.toDomain(dao.getUser()))
                .build();
    }

    private DocumentDAO toEntity(Document document) {
        return DocumentDAO.builder()
                .id(document.getId())
                .name(document.getName())
                .archive(document.getArchive())
                .loadDate(document.getLoadDate())
                .user(userRepositoryAdapter.toEntity(document.getUser()))
                .build();
    }
}
