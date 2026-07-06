package com.knot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TalentProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String skills;
    private String bio;
    private String portfolioLink;
}
