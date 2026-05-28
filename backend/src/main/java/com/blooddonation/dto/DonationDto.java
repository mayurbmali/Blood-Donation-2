package com.blooddonation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationDto {

    @NotNull(message = "Donor ID is required")
    private Long donorId;

    @NotNull(message = "Units donated is required")
    @Min(value = 1, message = "Units donated must be at least 1")
    private Integer unitsDonated;

    @NotNull(message = "Donation date is required")
    private LocalDate donationDate;
}
