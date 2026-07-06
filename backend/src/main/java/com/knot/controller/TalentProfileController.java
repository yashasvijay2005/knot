package com.knot.controller;

import com.knot.dto.TalentProfileRequest;
import com.knot.dto.TalentProfileResponse;
import com.knot.service.TalentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/talent-profiles")
@RequiredArgsConstructor
public class TalentProfileController {

    private final TalentProfileService talentProfileService;

    @GetMapping
    public ResponseEntity<List<TalentProfileResponse>> getAll() {
        return ResponseEntity.ok(talentProfileService.getAll());
    }

    @GetMapping("/me")
    public ResponseEntity<TalentProfileResponse> getMyProfile() {
        return ResponseEntity.ok(talentProfileService.getMyProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<TalentProfileResponse> upsertMyProfile(@RequestBody TalentProfileRequest request) {
        return ResponseEntity.ok(talentProfileService.upsertMyProfile(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<TalentProfileResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(talentProfileService.getByUserId(userId));
    }
}
