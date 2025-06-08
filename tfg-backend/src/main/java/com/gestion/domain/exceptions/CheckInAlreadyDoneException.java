package com.gestion.domain.exceptions;

public class CheckInAlreadyDoneException extends RuntimeException{
    public CheckInAlreadyDoneException(String message){
        super("Check-in already done");
    }
    public CheckInAlreadyDoneException(Long id) {
        super("Check-in already done by user with ID " + id);
    }
}
