package com.gestion.domain.exceptions;

public class RecordNotFoundException extends RuntimeException{
    public RecordNotFoundException(String message){
        super(message);
    }
    public RecordNotFoundException(Long id) {
        super("Record with ID " + id + " not found");
    }
}
