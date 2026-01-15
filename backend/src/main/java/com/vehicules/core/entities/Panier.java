package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "panier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Panier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", unique = true)
    private Client client;

    @OneToMany(mappedBy = "panier", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LignePanier> lignes = new ArrayList<>();

    @Column(name = "date_creation")
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_modification")
    private LocalDateTime dateModification = LocalDateTime.now();

    // Méthodes utilitaires
    public BigDecimal getMontantTotal() {
        return lignes.stream()
                .map(LignePanier::getPrixTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public int getNombreArticles() {
        return lignes.stream().mapToInt(LignePanier::getQuantite).sum();
    }

    public void ajouterLigne(LignePanier ligne) {
        lignes.add(ligne);
        ligne.setPanier(this);
        updateDateModification();
    }

    public void retirerLigne(LignePanier ligne) {
        lignes.remove(ligne);
        ligne.setPanier(null);
        updateDateModification();
    }

    private void updateDateModification() {
        this.dateModification = LocalDateTime.now();
    }
}
