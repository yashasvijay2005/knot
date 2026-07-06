package com.knot.repository;

import com.knot.model.Event;
import com.knot.model.Registration;
import com.knot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUser(User user);
    List<Registration> findByEvent(Event event);
    Optional<Registration> findByEventAndUser(Event event, User user);
    long countByEvent(Event event);
}
