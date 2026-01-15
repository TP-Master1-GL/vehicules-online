package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ligne_panier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LignePanier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panier_id")
    private Panier panier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;

    @Column(name = "quantite")
    private int quantite = 1;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "ligne_panier_options",
        joinColumns = @JoinColumn(name = "ligne_panier_id"),
        inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private List<OptionVehicule> options = new ArrayList<>();

    @Column(name = "prix_unitaire", precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    // Méthodes utilitaires
    public BigDecimal getPrixTotal() {
        BigDecimal total = prixUnitaire.multiply(BigDecimal.valueOf(quantite));

        // Ajouter le prix des options
        BigDecimal prixOptions = options.stream()
                .map(OptionVehicule::getPrix)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.add(prixOptions.multiply(BigDecimal.valueOf(quantite)));
    }

    public void ajouterOption(OptionVehicule option) {
        if (!options.contains(option)) {
            options.add(option);
        }
    }

    public void retirerOption(OptionVehicule option) {
        options.remove(option);
    }
}
