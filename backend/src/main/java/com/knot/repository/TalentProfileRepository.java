package com.knot.repository;

import com.knot.model.TalentProfile;
import com.knot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TalentProfileRepository extends JpaRepository<TalentProfile, Long> {
    Optional<TalentProfile> findByUser(User user);
    Optional<TalentProfile> findByUserId(Long userId);
}
