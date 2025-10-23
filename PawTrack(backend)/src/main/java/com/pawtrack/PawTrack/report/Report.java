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

    // ✅ Ensures perfect mapping to 'report_code' column
    @Column(name = "report_code", unique = true, nullable = false)
    private String reportCode;

    @NotBlank
    @Column(nullable = false)
    private String location;

    @NotBlank
    @Column(name = "animal_type", nullable = false)
    private String animalType;

    @NotBlank
    @Column(name = "animal_condition", nullable = false)
    private String animalCondition;

    @NotBlank
    @Column(name = "urgency_level", nullable = false)
    private String urgencyLevel;

    @NotBlank
    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "photo_url")
    private String photoUrl;

    @NotBlank
    @Column(name = "reporter_name", nullable = false)
    private String reporterName;

    @Pattern(regexp = "^[6-9]\\d{9}$")
    @Column(name = "reporter_phone", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String status = "pending";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ✅ Automatically sets createdAt and unique report code
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();

        // Generate unique code only if it's not set already
        if (this.reportCode == null || this.reportCode.isBlank()) {
            this.reportCode = "RPT-" + System.currentTimeMillis();
        }
    }

    // ✅ Helpful for debugging in console/logs
    @Override
    public String toString() {
        return "Report{" +
                "id=" + id +
                ", reportCode='" + reportCode + '\'' +
                ", location='" + location + '\'' +
                ", animalType='" + animalType + '\'' +
                ", animalCondition='" + animalCondition + '\'' +
                ", urgencyLevel='" + urgencyLevel + '\'' +
                ", reporterName='" + reporterName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
