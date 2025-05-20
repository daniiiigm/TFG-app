package com.gestion.application.controller;

import com.gestion.domain.model.Document;
import com.gestion.domain.model.User;
import com.gestion.domain.ports.in.DocumentUseCase;
import com.gestion.domain.ports.in.UserUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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

}
