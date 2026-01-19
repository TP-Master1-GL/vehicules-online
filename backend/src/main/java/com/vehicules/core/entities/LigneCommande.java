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
    // Ajouter dans la classe LigneCommande
// GETTERS
public Long getId() { return id; }
public Integer getQuantite() { return quantite; }
public BigDecimal getPrixUnitaire() { return prixUnitaire; }
public BigDecimal getPrixTotal() { return prixTotal; }
public Commande getCommande() { return commande; }
public Vehicule getVehicule() { return vehicule; }
public List<OptionVehicule> getOptions() { return options; }

// SETTERS
public void setId(Long id) { this.id = id; }
public void setQuantite(Integer quantite) { this.quantite = quantite; }
public void setPrixUnitaire(BigDecimal prixUnitaire) { this.prixUnitaire = prixUnitaire; }
public void setPrixTotal(BigDecimal prixTotal) { this.prixTotal = prixTotal; }
public void setCommande(Commande commande) { this.commande = commande; }
public void setVehicule(Vehicule vehicule) { this.vehicule = vehicule; }
public void setOptions(List<OptionVehicule> options) { this.options = options; }
}
