package com.vehicules.core.entities;

import com.vehicules.core.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "client_particulier")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ClientParticulier extends Client {
    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String numeroPermis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filiale_id")
    private Filiale filiale;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Override
    public String getType() {
        return "PARTICULIER";
    }

    // Getters et setters explicites pour ClientParticulier
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNumeroPermis() { return numeroPermis; }
    public void setNumeroPermis(String numeroPermis) { this.numeroPermis = numeroPermis; }

    public Filiale getFiliale() { return filiale; }
    public void setFiliale(Filiale filiale) { this.filiale = filiale; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}
