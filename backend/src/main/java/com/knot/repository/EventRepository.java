package com.knot.repository;

import com.knot.model.Event;
import com.knot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(User organizer);
    List<Event> findByCategoryIgnoreCaseContainingAndTitleIgnoreCaseContaining(String category, String title);
    List<Event> findByTitleIgnoreCaseContaining(String title);
    List<Event> findByCategoryIgnoreCaseContaining(String category);

    List<Event> findByStatus(com.knot.model.EventStatus status);
    List<Event> findByStatusAndCategoryIgnoreCaseContainingAndTitleIgnoreCaseContaining(com.knot.model.EventStatus status, String category, String title);
    List<Event> findByStatusAndTitleIgnoreCaseContaining(com.knot.model.EventStatus status, String title);
    List<Event> findByStatusAndCategoryIgnoreCaseContaining(com.knot.model.EventStatus status, String category);
}
