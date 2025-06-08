package com.gestion.domain.service;

import com.gestion.domain.exceptions.DeleteDocumentException;
import com.gestion.domain.exceptions.DocumentNotFoundException;
import com.gestion.domain.exceptions.SaveDocumentException;
import com.gestion.domain.exceptions.UserNotFoundException;
import com.gestion.domain.model.Document;
import com.gestion.domain.model.User;
import com.gestion.domain.ports.in.DocumentUseCase;
import com.gestion.domain.ports.out.DocumentRepositoryPort;
import com.gestion.domain.ports.out.UserRepositoryPort;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class DocumentService implements DocumentUseCase {
    private final DocumentRepositoryPort documentRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;
    @Override
    public List<Document> getAllDocuments() {
        return documentRepositoryPort.getAllDocuments();
    }

    @Override
    public Document getDocumentById(Long id) {
        return documentRepositoryPort.getDocumentById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));
    }

    @Override
    public Document uploadDocument(MultipartFile file, String name, Long userId) {
        User user = userRepositoryPort.getUserById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        String filePath = saveFileToDisk(file);

        Document document = Document.builder()
                .name(name)
                .archive(filePath)
                .loadDate(LocalDateTime.now())
                .user(user)
                .build();

        return documentRepositoryPort.uploadDocument(document);
    }

    @Override
    public Document deleteDocument(Long id) {
        Document document = documentRepositoryPort.getDocumentById(id)
                .orElseThrow(() -> new DocumentNotFoundException(id));

        try {
            Files.deleteIfExists(Paths.get(document.getArchive()));
        } catch (IOException e) {
            throw new DeleteDocumentException(e);
        }

        documentRepositoryPort.deleteDocument(id);
        return document;
    }

    @Override
    public List<Document> getDocumentsByUserId(Long userId) {
        return documentRepositoryPort.getDocumentsByUserId(userId);
    }

    private String saveFileToDisk(MultipartFile file) {
        String folderPath = "uploads/"; // o configurable por application.yml
        File folder = new File(folderPath);
        if (!folder.exists()) folder.mkdirs();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(folderPath + fileName);

        try {
            Files.write(path, file.getBytes());
            return path.toString();
        } catch (IOException e) {
            throw new SaveDocumentException(e);
        }
    }
}
