package com.gestion.domain.exceptions;

public class WrongPasswordException extends RuntimeException{
    public WrongPasswordException(String message){
        super(message);
    }
    public WrongPasswordException(Long userId) {
        super("Wrong password fo user with ID " + userId);
    }
}
