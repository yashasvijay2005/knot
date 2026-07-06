package com.knot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String location;
    private LocalDateTime eventDate;
    private Integer capacity;
    private long registeredCount;
    private Long organizerId;
    private String organizerName;
    private Double price;
    private String status;
}
