package com.knot.controller;

import com.knot.dto.EventRequest;
import com.knot.dto.EventResponse;
import com.knot.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(eventService.getAllEvents(category, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEvent(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EventResponse>> getMyEvents() {
        return ResponseEntity.ok(eventService.getMyEvents());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<EventResponse>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getPendingEvents());
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.approveEvent(id));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<EventResponse> rejectEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.rejectEvent(id));
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.createEvent(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
