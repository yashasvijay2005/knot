package com.knot.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "talent_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TalentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 500)
    private String skills;

    @Column(length = 2000)
    private String bio;

    private String portfolioLink;
}
