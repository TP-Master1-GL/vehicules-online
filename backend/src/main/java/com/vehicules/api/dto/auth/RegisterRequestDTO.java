package com.vehicules.api.dto.auth;

import com.vehicules.core.enums.Role;

public class RegisterRequestDTO {
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String telephone;
    private Role role = Role.USER;

    public RegisterRequestDTO() {}

    public RegisterRequestDTO(String nom, String prenom, String email, String password, String telephone, Role role) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.telephone = telephone;
        this.role = role;
    }

    // Getters and Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
