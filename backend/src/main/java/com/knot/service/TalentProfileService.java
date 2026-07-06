package com.knot.service;

import com.knot.dto.TalentProfileRequest;
import com.knot.dto.TalentProfileResponse;
import com.knot.exception.ResourceNotFoundException;
import com.knot.model.TalentProfile;
import com.knot.model.User;
import com.knot.repository.TalentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TalentProfileService {

    private final TalentProfileRepository talentProfileRepository;
    private final CurrentUserService currentUserService;

    public TalentProfileResponse upsertMyProfile(TalentProfileRequest request) {
        User user = currentUserService.getCurrentUser();
        TalentProfile profile = talentProfileRepository.findByUser(user)
                .orElse(TalentProfile.builder().user(user).build());

        profile.setSkills(request.getSkills());
        profile.setBio(request.getBio());
        profile.setPortfolioLink(request.getPortfolioLink());

        profile = talentProfileRepository.save(profile);
        return toResponse(profile);
    }

    public TalentProfileResponse getMyProfile() {
        User user = currentUserService.getCurrentUser();
        TalentProfile profile = talentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("No talent profile found. Create one first."));
        return toResponse(profile);
    }

    public TalentProfileResponse getByUserId(Long userId) {
        TalentProfile profile = talentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Talent profile not found"));
        return toResponse(profile);
    }

    public List<TalentProfileResponse> getAll() {
        return talentProfileRepository.findAll().stream().map(this::toResponse).toList();
    }

    private TalentProfileResponse toResponse(TalentProfile p) {
        return TalentProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .fullName(p.getUser().getFullName())
                .skills(p.getSkills())
                .bio(p.getBio())
                .portfolioLink(p.getPortfolioLink())
                .build();
    }
}
