package com.gestion.domain.service;

import com.gestion.domain.model.Document;
import com.gestion.domain.ports.in.DocumentUseCase;
import com.gestion.domain.ports.out.DocumentRepositoryPort;
import com.gestion.domain.ports.out.RecordRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class DocumentService implements DocumentUseCase {
    private final DocumentRepositoryPort documentRepositoryPort;
    @Override
    public List<Document> getAllDocuments() {
        return documentRepositoryPort.getAllDocuments();
    }
}
