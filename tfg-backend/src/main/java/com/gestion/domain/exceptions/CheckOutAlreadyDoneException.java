package com.gestion.domain.exceptions;

public class CheckOutAlreadyDoneException extends RuntimeException{
    public CheckOutAlreadyDoneException(String message){
        super("Check-out already done");
    }
    public CheckOutAlreadyDoneException(Long id) {
        super("Check-out already done by user with ID " + id);
    }
}
