// src/main/java/com/vehicules/patterns/template/CalculCommandeFactory.java
package com.vehicules.patterns.template;

import com.vehicules.core.entities.Commande;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CalculCommandeFactory {
    
    @Autowired
    private CalculCommandeFR calculCommandeFR;
    
    @Autowired
    private CalculCommandeLU calculCommandeLU;
    
    @Autowired
    private CalculCommandeBE calculCommandeBE;
    
    public CalculCommandeTemplate getCalculateur(Commande commande) {
        if (commande == null || commande.getPaysLivraison() == null) {
            throw new IllegalArgumentException("Commande ou pays de livraison invalide");
        }
        
        String pays = commande.getPaysLivraison().toUpperCase();
        
        switch (pays) {
            case "FR":
            case "FRANCE":
                return calculCommandeFR;
            case "LU":
            case "LUXEMBOURG":
                return calculCommandeLU;
            case "BE":
            case "BELGIQUE":
                return calculCommandeBE;
            default:
                throw new UnsupportedOperationException(
                    "Calculateur non disponible pour le pays: " + pays
                );
        }
    }
}