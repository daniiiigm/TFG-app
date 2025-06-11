package com.gestion.application.controller;

import com.gestion.domain.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test-email")
public class TestEmailController {
    private final EmailService emailService;

    @GetMapping
    public String testEmail() {
        try {
            emailService.sendInactivityEmail("danigarciamartinn@gmail.com", "Daniel");
            return "Correo enviado!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
