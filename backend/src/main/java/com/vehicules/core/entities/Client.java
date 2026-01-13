package com.vehicules.core.entities;

import com.vehicules.core.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "client")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Client implements UserDetails {
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

    // Méthodes UserDetails pour Spring Security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Pour ClientParticulier, retourner le rôle
        if (this instanceof ClientParticulier) {
            ClientParticulier particulier = (ClientParticulier) this;
            return Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + particulier.getRole().name())
            );
        }
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        if (this instanceof ClientParticulier) {
            return ((ClientParticulier) this).getPassword();
        }
        return "";
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        if (this instanceof ClientParticulier) {
            return ((ClientParticulier) this).isEnabled();
        }
        return true;
    }

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
        return Role.USER;
    }

    public void setPassword(String password) {
        if (this instanceof ClientParticulier) {
            ((ClientParticulier) this).setPassword(password);
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
