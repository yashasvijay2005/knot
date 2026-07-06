package com.knot.controller;

import com.knot.dto.RegistrationResponse;
import com.knot.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/{eventId}")
    public ResponseEntity<RegistrationResponse> register(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.register(eventId));
    }

    @PostMapping("/{registrationId}/pay")
    public ResponseEntity<RegistrationResponse> simulatePayment(@PathVariable Long registrationId) {
        return ResponseEntity.ok(registrationService.simulatePayment(registrationId));
    }

    @DeleteMapping("/{registrationId}")
    public ResponseEntity<Void> cancel(@PathVariable Long registrationId) {
        registrationService.cancel(registrationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<RegistrationResponse>> myRegistrations() {
        return ResponseEntity.ok(registrationService.getMyRegistrations());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<RegistrationResponse>> eventRegistrations(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getEventRegistrations(eventId));
    }

    @PatchMapping("/{registrationId}/check-in")
    public ResponseEntity<RegistrationResponse> checkIn(@PathVariable Long registrationId) {
        return ResponseEntity.ok(registrationService.checkIn(registrationId));
    }

    @GetMapping("/{registrationId}/certificate")
    public ResponseEntity<byte[]> getCertificate(@PathVariable Long registrationId) {
        byte[] pdfBytes = registrationService.generateCertificate(registrationId);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "certificate.pdf");

        return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
    }
}
