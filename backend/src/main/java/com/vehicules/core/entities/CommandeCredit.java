package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commande_credit")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CommandeCredit extends Commande {
    @Column(nullable = false)
    private Integer dureeMois; // durée du crédit en mois

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal tauxInteret; // taux d'intérêt annuel

    @Column(precision = 10, scale = 2)
    private BigDecimal mensualite;

    @Column
    private String organismeCredit;

    @Column
    private LocalDateTime dateApprobation;

    @Override
    public String getTypePaiement() {
        return "CREDIT";
    }
}
