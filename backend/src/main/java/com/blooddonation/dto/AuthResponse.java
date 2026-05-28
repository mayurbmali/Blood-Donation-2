package com.blooddonation.dto;

import com.blooddonation.model.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String name;
    private Role role;
}
