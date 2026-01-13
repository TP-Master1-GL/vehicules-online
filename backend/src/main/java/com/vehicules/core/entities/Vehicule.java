package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "vehicule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)


public abstract class Vehicule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String marque;

    @Column(nullable = false)
    private String modele;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prixBase;

    @Column(nullable = false)
    private LocalDate dateStock;

    @Column(nullable = false)
    private Boolean enSolde = false;

    @Column(precision = 5, scale = 2)
    private BigDecimal pourcentageSolde;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "vehicule_option",
            joinColumns = @JoinColumn(name = "vehicule_id"),
            inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private List<OptionVehicule> options;

    public abstract String getType();
    public abstract String getEnergie();

    public String getTypeEnergie() {
        return getEnergie();
    }

    public BigDecimal getPrix() {
        return getPrixFinal();
    }

    public BigDecimal getPrixFinal() {
        BigDecimal prix = prixBase;
        if (enSolde && pourcentageSolde != null) {
            prix = prix.subtract(prix.multiply(pourcentageSolde.divide(BigDecimal.valueOf(100))));
        }
        return prix;
    }
}
