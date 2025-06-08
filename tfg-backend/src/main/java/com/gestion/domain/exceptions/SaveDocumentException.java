package com.gestion.domain.exceptions;

public class SaveDocumentException extends RuntimeException{
    public SaveDocumentException(String message){
        super(message);
    }
    public SaveDocumentException(Exception e) {
        super("Error al guardar el archivo " + e);
    }
}
