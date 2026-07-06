package com.knot.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {
    @NotBlank
    private String title;

    private String description;

    private String category;

    private String location;

    @NotNull
    private LocalDateTime eventDate;

    private Integer capacity;

    private Double price;
}
