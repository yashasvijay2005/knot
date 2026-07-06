package com.knot.service;

import com.knot.dto.RegistrationResponse;
import com.knot.exception.BadRequestException;
import com.knot.exception.ResourceNotFoundException;
import com.knot.model.Event;
import com.knot.model.Registration;
import com.knot.model.Role;
import com.knot.model.User;
import com.knot.repository.EventRepository;
import com.knot.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final CurrentUserService currentUserService;
    private final EmailService emailService;
    private final CertificateService certificateService;

    public RegistrationResponse register(Long eventId) {
        User user = currentUserService.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        registrationRepository.findByEventAndUser(event, user).ifPresent(r -> {
            throw new BadRequestException("You are already registered for this event");
        });

        if (event.getCapacity() != null) {
            long current = registrationRepository.countByEvent(event);
            if (current >= event.getCapacity()) {
                throw new BadRequestException("This event is fully booked");
            }
        }

        Registration registration = Registration.builder()
                .event(event)
                .user(user)
                .status(com.knot.model.RegistrationStatus.REGISTERED)
                .paymentStatus(event.getPrice() != null && event.getPrice() > 0 ? com.knot.model.PaymentStatus.PENDING : com.knot.model.PaymentStatus.NOT_APPLICABLE)
                .build();

        registration = registrationRepository.save(registration);

        if (registration.getPaymentStatus() == com.knot.model.PaymentStatus.NOT_APPLICABLE) {
            emailService.sendRegistrationEmail(user.getEmail(), user.getFullName(), event.getTitle());
        }

        return toResponse(registration);
    }

    public RegistrationResponse simulatePayment(Long registrationId) {
        User user = currentUserService.getCurrentUser();
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if (!registration.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to pay for this registration");
        }

        if (registration.getPaymentStatus() == com.knot.model.PaymentStatus.PENDING) {
            registration.setPaymentStatus(com.knot.model.PaymentStatus.COMPLETED);
            registration = registrationRepository.save(registration);
            emailService.sendRegistrationEmail(user.getEmail(), user.getFullName(), registration.getEvent().getTitle());
        }

        return toResponse(registration);
    }

    public void cancel(Long registrationId) {
        User user = currentUserService.getCurrentUser();
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        boolean isOwner = registration.getUser().getId().equals(user.getId());
        boolean isOrganizerOfEvent = registration.getEvent().getOrganizer().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isOrganizerOfEvent && !isAdmin) {
            throw new BadRequestException("You are not authorized to cancel this registration");
        }

        registrationRepository.delete(registration);
    }

    public List<RegistrationResponse> getMyRegistrations() {
        User user = currentUserService.getCurrentUser();
        return registrationRepository.findByUser(user).stream().map(this::toResponse).toList();
    }

    public RegistrationResponse checkIn(Long registrationId) {
        User currentUser = currentUserService.getCurrentUser();
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        boolean isOrganizerOfEvent = registration.getEvent().getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOrganizerOfEvent && !isAdmin) {
            throw new BadRequestException("You are not authorized to check-in this user");
        }

        if (registration.getPaymentStatus() == com.knot.model.PaymentStatus.PENDING) {
             throw new BadRequestException("Cannot check in user because payment is pending.");
        }

        registration.setStatus(com.knot.model.RegistrationStatus.ATTENDED);
        registration = registrationRepository.save(registration);
        return toResponse(registration);
    }

    public List<RegistrationResponse> getEventRegistrations(Long eventId) {
        User currentUser = currentUserService.getCurrentUser();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        boolean isOwner = event.getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You are not authorized to view these registrations");
        }

        return registrationRepository.findByEvent(event).stream().map(this::toResponse).toList();
    }

    public byte[] generateCertificate(Long registrationId) {
        User user = currentUserService.getCurrentUser();
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if (!registration.getUser().getId().equals(user.getId())) {
             throw new BadRequestException("You can only generate certificates for your own registrations");
        }

        if (registration.getStatus() != com.knot.model.RegistrationStatus.ATTENDED) {
             throw new BadRequestException("You must attend the event to get a certificate");
        }

        return certificateService.generateCertificate(
                user.getFullName(),
                registration.getEvent().getTitle(),
                registration.getEvent().getEventDate().toString()
        );
    }

    private RegistrationResponse toResponse(Registration r) {
        return RegistrationResponse.builder()
                .id(r.getId())
                .eventId(r.getEvent().getId())
                .eventTitle(r.getEvent().getTitle())
                .userId(r.getUser().getId())
                .userName(r.getUser().getFullName())
                .userEmail(r.getUser().getEmail())
                .registeredAt(r.getRegisteredAt())
                .status(r.getStatus() != null ? r.getStatus().name() : null)
                .paymentStatus(r.getPaymentStatus() != null ? r.getPaymentStatus().name() : null)
                .build();
    }
}
