package com.vehicules.api.dto.auth;

import com.vehicules.core.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class AuthenticationResponseDTO {
    // Getters and Setters
    private String token;
    private String refreshToken;
    private String email;
    private String nom;
    private String prenom;
    private Role role;
    private String type = "Bearer";


    public AuthenticationResponseDTO(String jwtToken, String refreshToken, String email, String nom, String prenom, Role role) {
    }
}
