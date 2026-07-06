package com.knot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class RegistrationResponse {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long userId;
    private String userName;
    private String userEmail;
    private LocalDateTime registeredAt;
    private String status;
    private String paymentStatus;
}
