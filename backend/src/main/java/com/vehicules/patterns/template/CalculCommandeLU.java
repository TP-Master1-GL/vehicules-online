// src/main/java/com/vehicules/patterns/template/CalculCommandeLU.java
package com.vehicules.patterns.template;

import com.vehicules.entities.Commande;
import org.springframework.stereotype.Component;

@Component
public class CalculCommandeLU extends CalculCommandeTemplate {
    private static final double TVA_LU = 0.17;
    private static final double REMISE_ENTREPRISE = 0.02;
    private static final double FRAIS_LIVRAISON_LU = 15.0;
    private static final double TAXE_VOITURE_LU = 0.05;
    
    @Override
    protected double appliquerTaxes(double sousTotal, Commande commande) {
        // TVA standard + taxe spécifique pour voitures
        double totalTVA = sousTotal * (1 + TVA_LU);
        
        // Taxe supplémentaire pour les voitures au Luxembourg
        boolean contientVoiture = commande.getLignes().stream()
            .anyMatch(ligne -> 
                ligne.getVehicule() != null && 
                "VOITURE".equalsIgnoreCase(ligne.getVehicule().getType()));
        
        if (contientVoiture) {
            totalTVA += sousTotal * TAXE_VOITURE_LU;
        }
        
        return totalTVA;
    }
    
    @Override
    protected double appliquerRemises(double total, Commande commande) {
        // Remise de 2% pour les entreprises au Luxembourg
        if (commande.getClient() != null && commande.getClient().estEntreprise()) {
            return total * (1 - REMISE_ENTREPRISE);
        }
        return total;
    }
    
    @Override
    protected double calculeTotalLivraison(double total, Commande commande) {
        // Frais de livraison fixes pour le Luxembourg
        return total + FRAIS_LIVRAISON_LU;
    }
}