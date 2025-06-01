package com.gestion.domain.ports.in;

import com.gestion.application.model.DocumentRequestDTO;
import com.gestion.domain.model.Document;
import org.springframework.web.multipart.MultipartFile;

import javax.print.Doc;
import java.util.List;

public interface DocumentUseCase {
    List<Document> getAllDocuments();
    Document getDocumentById(Long id);
    Document uploadDocument(MultipartFile file, String name, Long userId);
    Document deleteDocument(Long id);
    List<Document> getDocumentsByUserId(Long userId);
}
