package com.gestion.domain.ports.in;

import com.gestion.domain.model.Document;

import java.util.List;

public interface DocumentUseCase {
    List<Document> getAllDocuments();
}
