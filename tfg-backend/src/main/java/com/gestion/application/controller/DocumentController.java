package com.gestion.application.controller;

import com.gestion.domain.model.Document;
import com.gestion.domain.model.Record;
import com.gestion.domain.model.User;
import com.gestion.domain.ports.in.DocumentUseCase;
import com.gestion.domain.ports.in.UserUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/documents")
public class DocumentController {

    private final DocumentUseCase documentUseCase;

    @Operation(summary = "Endpoint to get all docs")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(value = "/all")
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentUseCase.getAllDocuments();

        return ResponseEntity.ok(documents);
    }

    @Operation(summary = "Endpoint to get a document by id")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(value = "/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        try {
            Document document = documentUseCase.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @Operation(summary = "Upload a document with file")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/upload/{userId}")
    public ResponseEntity<Document> uploadDocument(@PathVariable Long userId, @RequestParam("file") MultipartFile file, @RequestParam("name") String name) {
        Document saved = documentUseCase.uploadDocument(file, name, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Operation(summary = "Endpoint to delete a document by id")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<Document> deleteDocument(@PathVariable Long id) {
        Document deletedDoc = documentUseCase.deleteDocument(id);
        return ResponseEntity.status(HttpStatus.OK).body(deletedDoc);
    }

    @Operation(summary = "Endpoint to get all documents from one user")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/all-documents/{userId}")
    public ResponseEntity<List<Document>> getAllDocumentsByUser(@PathVariable Long userId) {
        List<Document> documents = documentUseCase.getDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }

}
