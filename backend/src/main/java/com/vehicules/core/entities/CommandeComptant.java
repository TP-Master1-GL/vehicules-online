// src/main/java/com/vehicules/core/entities/CommandeComptant.java
package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "commande_comptant")
public class CommandeComptant extends Commande {
    
    @Column(name = "mode_paiement")
    private String modePaiement;
    
    // Getters et Setters
    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }
    
    @Override
    public String getTypePaiement() {
        return "COMPTANT";
    }
}