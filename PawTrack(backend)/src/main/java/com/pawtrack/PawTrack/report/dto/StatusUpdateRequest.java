package com.pawtrack.PawTrack.report.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusUpdateRequest {

    @NotBlank
    private String status; // pending / in-progress / resolved
}
