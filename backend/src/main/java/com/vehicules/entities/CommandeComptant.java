package com.vehicules.entities;

import javax.persistence.Entity;

@Entity
public class CommandeComptant extends Commande {
    
    // Constructeurs
    public CommandeComptant() {
        super();
    }
    
    public CommandeComptant(String numero, double montant) {
        super(numero, montant);
    }
}