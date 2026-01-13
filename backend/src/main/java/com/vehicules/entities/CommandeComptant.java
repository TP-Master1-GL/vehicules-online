package com.vehicules.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class CommandeComptant extends Commande {
    @Id
    private String id; // Ajout de l'attribut id
    
    // Constructeurs
    public CommandeComptant() {
        super();
    }
    
    public CommandeComptant(String numero, double montant) {
        super(numero, montant);
    }
}