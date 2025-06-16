package com.gestion.domain.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendInactivityEmail(String toEmail, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreplygestiondeusuarios@gmail.com");
        message.setTo(toEmail);
        message.setSubject("⚠️ Recordatorio: Check-in pendiente");
        message.setText(
                "Hola " + userName + ",\n\n" +
                        "Notamos que no has registrado tu entrada en los últimos 3 días.\n\n" +
                        "Saludos,\nEquipo de Gestión"
        );

        mailSender.send(message);
    }
}
