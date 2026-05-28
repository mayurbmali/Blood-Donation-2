package com.blooddonation.dto;

import com.blooddonation.model.BloodGroup;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequestDto {

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Units is required")
    @Min(value = 1, message = "Units must be at least 1")
    private Integer units;
}
