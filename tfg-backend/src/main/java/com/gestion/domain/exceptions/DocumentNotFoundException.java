package com.gestion.domain.exceptions;

public class DocumentNotFoundException extends RuntimeException{
    public DocumentNotFoundException(String message){
        super(message);
    }
    public DocumentNotFoundException(Long id) {
        super("Document with ID " + id + " not found");
    }
}
