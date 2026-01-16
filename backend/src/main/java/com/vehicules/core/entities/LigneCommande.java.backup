package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "ligne_commande")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantite = 1;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prixTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicule_id", nullable = false)
    private Vehicule vehicule;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "ligne_commande_option",
            joinColumns = @JoinColumn(name = "ligne_commande_id"),
            inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private List<OptionVehicule> options;

    @PrePersist
    @PreUpdate
    public void calculerPrixTotal() {
        BigDecimal prixOptions = BigDecimal.ZERO;
        if (options != null && !options.isEmpty()) {
            prixOptions = options.stream()
                    .map(OptionVehicule::getPrix)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        this.prixTotal = prixUnitaire.add(prixOptions).multiply(BigDecimal.valueOf(quantite));
    }
}
