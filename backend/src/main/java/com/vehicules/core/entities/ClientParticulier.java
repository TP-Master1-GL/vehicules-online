package com.vehicules.core.entities;

import com.vehicules.core.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client_particulier")
@PrimaryKeyJoinColumn(name = "client_id")  // CETTE ANNOTATION MANQUE - CRITIQUE !
@DiscriminatorValue("ClientParticulier")   // CETTE ANNOTATION MANQUE - DOIT MATCHER dtype
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
        return "ClientParticulier";  // CHANGEZ "PARTICULIER" en "ClientParticulier"
    }

    // Supprimez les getters/setters explicites - Lombok les génère
    // Sauf si vous en avez vraiment besoin pour une logique spécifique
}