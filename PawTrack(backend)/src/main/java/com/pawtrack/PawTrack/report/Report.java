package com.pawtrack.PawTrack.report;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique Report Code e.g., RPT-1735234523
    @Column(unique = true, nullable = false)
    private String reportCode;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @NotBlank
    @Column(nullable = false)
    private String animalType;   // Dog / Cat / etc.

    @NotBlank
    @Column(name = "animal_condition", nullable = false)
    private String animalCondition;    // Injured / Sick / etc.

    @NotBlank
    @Column(nullable = false)
    private String urgencyLevel; // critical / high / medium / low

    @NotBlank
    @Column(nullable = false, length = 2000)
    private String description;

    private String photoUrl;     // optional (for later image upload)

    @NotBlank
    @Column(nullable = false)
    private String reporterName;

    // phone number 10 digits (Indian number)
    @Pattern(regexp = "^[6-9]\\d{9}$")
    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String status = "pending"; // pending/in-progress/resolved

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();

        if (this.reportCode == null || this.reportCode.isBlank()) {
            this.reportCode = "RPT-" + System.currentTimeMillis();
        }
    }
}
