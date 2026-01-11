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
import lombok.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "client_particulier")
@Data
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
}
