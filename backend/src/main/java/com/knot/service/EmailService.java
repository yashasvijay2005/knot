package com.knot.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendRegistrationEmail(String toEmail, String userName, String eventTitle) {
        System.out.println("=========================================");
        System.out.println("MOCK EMAIL SENT");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Registration Confirmed for " + eventTitle);
        System.out.println("Body: Hello " + userName + ",\n\nYou have successfully registered for the event: " + eventTitle + ".");
        System.out.println("=========================================");
    }
}
