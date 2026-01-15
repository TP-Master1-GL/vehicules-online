package com.vehicules.core.entities;

import com.vehicules.core.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Collections;

@Entity
@Table(name = "client")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telephone;

    @Column(nullable = false)
    private String adresse;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Commande> commandes;

    public abstract String getType();

    // Getters et setters explicites pour les champs de base
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public List<Commande> getCommandes() { return commandes; }
    public void setCommandes(List<Commande> commandes) { this.commandes = commandes; }



    // Méthodes utilitaires pour les services
    public String getPrenom() {
        if (this instanceof ClientParticulier) {
            return ((ClientParticulier) this).getPrenom();
        }
        return "";
    }

    public Role getRole() {
        if (this instanceof ClientParticulier) {
            return ((ClientParticulier) this).getRole();
        }
        return Role.USER; // ou définir un rôle par défaut pour les sociétés
    }

    public String getPassword() {
        if (this instanceof ClientParticulier) {
            return ((ClientParticulier) this).getPassword();
        } else if (this instanceof Societe) {
            return ((Societe) this).getPassword();
        }
        return ""; // mot de passe par défaut si aucun type
    }

    public void setPassword(String password) {
        if (this instanceof ClientParticulier) {
            ((ClientParticulier) this).setPassword(password);
        } else if (this instanceof Societe) {
            ((Societe) this).setPassword(password);
        }
    }

    public void setRole(Role role) {
        if (this instanceof ClientParticulier) {
            ((ClientParticulier) this).setRole(role);
        }
    }

    public void setEnabled(boolean enabled) {
        if (this instanceof ClientParticulier) {
            ((ClientParticulier) this).setEnabled(enabled);
        }
    }

    public boolean estEntreprise() {
        return this instanceof Societe;
    }
}