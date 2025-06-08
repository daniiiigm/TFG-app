package com.gestion.domain.exceptions;

public class DeleteDocumentException extends RuntimeException{
    public DeleteDocumentException(String message){
        super(message);
    }
    public DeleteDocumentException(Exception e) {
        super("No se pudo eliminar el archivo físico " + e);
    }
}
