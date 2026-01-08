// src/main/java/com/vehicules/patterns/template/CalculCommandeBE.java
package com.vehicules.patterns.template;

import com.vehicules.entities.Commande;
import org.springframework.stereotype.Component;

@Component
public class CalculCommandeBE extends CalculCommandeTemplate {
    private static final double TVA_BE = 0.21;
    private static final double FRAIS_LIVRAISON_BE = 20.0;
    
    @Override
    protected double appliquerTaxes(double sousTotal, Commande commande) {
        return sousTotal * (1 + TVA_BE);
    }
    
    @Override
    protected double appliquerRemises(double total, Commande commande) {
        // Pas de remise en Belgique
        return total;
    }
    
    @Override
    protected double calculeTotalLivraison(double total, Commande commande) {
        return total + FRAIS_LIVRAISON_BE;
    }
}