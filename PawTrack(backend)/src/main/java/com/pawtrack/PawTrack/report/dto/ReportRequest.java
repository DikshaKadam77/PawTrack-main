package com.pawtrack.PawTrack.report.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportRequest {

    @NotBlank
    private String location;

    @NotBlank
    private String animalType;

    @NotBlank
    private String animalCondition;

    @NotBlank
    private String urgencyLevel;

    @NotBlank
    private String description;

    private String photoUrl; // optional

    @NotBlank
    private String reporterName;

    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String phoneNumber;
}
