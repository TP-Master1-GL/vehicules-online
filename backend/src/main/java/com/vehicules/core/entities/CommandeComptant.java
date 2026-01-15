package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "commande_comptant")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CommandeComptant extends Commande {
    @Column(nullable = false)
    private String modePaiement; // ESPECES, CARTE_BANCAIRE, VIREMENT

    @Column
    private LocalDateTime datePaiement;

    @Override
    public String getTypePaiement() {
        return "COMPTANT";
    }
}
