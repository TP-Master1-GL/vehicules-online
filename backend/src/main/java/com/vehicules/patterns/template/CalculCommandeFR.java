// src/main/java/com/vehicules/patterns/template/CalculCommandeFR.java
package com.vehicules.patterns.template;

import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.LigneCommande;
import org.springframework.stereotype.Component;

@Component
public class CalculCommandeFR extends CalculCommandeTemplate {
    private static final double TVA_STANDARD = 0.20;
    private static final double TVA_REDUITE = 0.10;
    private static final double FRAIS_LIVRAISON_FR = 25.0;
    private static final double SEUIL_REMISE = 20000.0;
    private static final double TAUX_REMISE = 0.05;
    
    @Override
    protected double appliquerTaxes(double sousTotal, Commande commande) {
        // Vérifier si un véhicule est électrique pour TVA réduite
        boolean vehiculeElectrique = commande.getLignes().stream()
            .anyMatch(ligne -> 
                ligne.getVehicule() != null && 
                "ELECTRIQUE".equalsIgnoreCase(ligne.getVehicule().getTypeEnergie()));
        
        double tauxTVA = vehiculeElectrique ? TVA_REDUITE : TVA_STANDARD;
        return sousTotal * (1 + tauxTVA);
    }
    
    @Override
    protected double appliquerRemises(double total, Commande commande) {
        // Remise de 5% si commande > 20000€ (calculée sur le sous-total)
        double sousTotal = calculeSousTotal(commande);
        if (sousTotal > SEUIL_REMISE) {
            return total * (1 - TAUX_REMISE);
        }
        return total;
    }
    
    @Override
    protected double calculeTotalLivraison(double total, Commande commande) {
        // Frais de livraison fixes pour la France
        return total + FRAIS_LIVRAISON_FR;

}
}