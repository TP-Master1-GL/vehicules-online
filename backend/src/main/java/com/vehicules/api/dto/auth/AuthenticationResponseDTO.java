package com.vehicules.api.dto.auth;

import com.vehicules.core.enums.Role;

public class AuthenticationResponseDTO {
    private String token;
    private String refreshToken;
    private String email;
    private String nom;
    private String prenom;
    private Role role;
    private String type = "Bearer";

    public AuthenticationResponseDTO() {}

    public AuthenticationResponseDTO(String token, String refreshToken, String email, String nom, String prenom, Role role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
