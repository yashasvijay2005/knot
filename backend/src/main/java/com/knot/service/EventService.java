package com.knot.service;

import com.knot.dto.EventRequest;
import com.knot.dto.EventResponse;
import com.knot.exception.BadRequestException;
import com.knot.exception.ResourceNotFoundException;
import com.knot.model.Event;
import com.knot.model.Role;
import com.knot.model.User;
import com.knot.repository.EventRepository;
import com.knot.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final CurrentUserService currentUserService;

    public EventResponse createEvent(EventRequest request) {
        User organizer = currentUserService.getCurrentUser();
        if (organizer.getRole() != Role.ORGANIZER && organizer.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only organizers can create events");
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .capacity(request.getCapacity())
                .price(request.getPrice() != null ? request.getPrice() : 0.0)
                .status(com.knot.model.EventStatus.PENDING)
                .organizer(organizer)
                .build();

        event = eventRepository.save(event);
        return toResponse(event);
    }

    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = getEventOrThrow(id);
        User currentUser = currentUserService.getCurrentUser();
        assertOwnerOrAdmin(event, currentUser);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setCapacity(request.getCapacity());
        if (request.getPrice() != null) {
            event.setPrice(request.getPrice());
        }

        event = eventRepository.save(event);
        return toResponse(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventOrThrow(id);
        User currentUser = currentUserService.getCurrentUser();
        assertOwnerOrAdmin(event, currentUser);
        eventRepository.delete(event);
    }

    public EventResponse getEvent(Long id) {
        return toResponse(getEventOrThrow(id));
    }

    public List<EventResponse> getAllEvents(String category, String keyword) {
        List<Event> events;
        if (category != null && !category.isBlank() && keyword != null && !keyword.isBlank()) {
            events = eventRepository.findByStatusAndCategoryIgnoreCaseContainingAndTitleIgnoreCaseContaining(com.knot.model.EventStatus.APPROVED, category, keyword);
        } else if (category != null && !category.isBlank()) {
            events = eventRepository.findByStatusAndCategoryIgnoreCaseContaining(com.knot.model.EventStatus.APPROVED, category);
        } else if (keyword != null && !keyword.isBlank()) {
            events = eventRepository.findByStatusAndTitleIgnoreCaseContaining(com.knot.model.EventStatus.APPROVED, keyword);
        } else {
            events = eventRepository.findByStatus(com.knot.model.EventStatus.APPROVED);
        }
        return events.stream().map(this::toResponse).toList();
    }

    public List<EventResponse> getPendingEvents() {
        User currentUser = currentUserService.getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only admins can view pending events");
        }
        return eventRepository.findByStatus(com.knot.model.EventStatus.PENDING)
                .stream().map(this::toResponse).toList();
    }

    public EventResponse approveEvent(Long id) {
        return updateEventStatus(id, com.knot.model.EventStatus.APPROVED);
    }

    public EventResponse rejectEvent(Long id) {
        return updateEventStatus(id, com.knot.model.EventStatus.REJECTED);
    }

    private EventResponse updateEventStatus(Long id, com.knot.model.EventStatus newStatus) {
        User currentUser = currentUserService.getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only admins can update event status");
        }
        Event event = getEventOrThrow(id);
        event.setStatus(newStatus);
        event = eventRepository.save(event);
        return toResponse(event);
    }

    public List<EventResponse> getMyEvents() {
        User organizer = currentUserService.getCurrentUser();
        return eventRepository.findByOrganizer(organizer).stream().map(this::toResponse).toList();
    }

    private Event getEventOrThrow(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    private void assertOwnerOrAdmin(Event event, User user) {
        boolean isOwner = event.getOrganizer().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You are not authorized to modify this event");
        }
    }

    private EventResponse toResponse(Event event) {
        long count = registrationRepository.countByEvent(event);
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .location(event.getLocation())
                .eventDate(event.getEventDate())
                .capacity(event.getCapacity())
                .registeredCount(count)
                .organizerId(event.getOrganizer().getId())
                .organizerName(event.getOrganizer().getFullName())
                .price(event.getPrice())
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .build();
    }
}
