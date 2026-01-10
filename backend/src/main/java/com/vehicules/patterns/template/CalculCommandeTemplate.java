// src/main/java/com/vehicules/patterns/template/CalculCommandeTemplate.java
package com.vehicules.patterns.template;

import com.vehicules.core.entities.Commande;
import org.springframework.stereotype.Component;

@Component
public abstract class CalculCommandeTemplate {
    
    // Méthode Template (finale) - respecte le diagramme
    public final double calculeTotal(Commande commande) {
        double sousTotal = calculeSousTotal(commande);
        double avecTaxes = appliquerTaxes(sousTotal, commande);
        double avecRemises = appliquerRemises(avecTaxes, commande);
        double avecLivraison = calculeTotalLivraison(avecRemises, commande);
        return avecLivraison;
    }
    
    // Méthode publique pour le calcul simple (sans livraison)
    public final double calculeTotalTVA(Commande commande) {
        double sousTotal = calculeSousTotal(commande);
        double avecTaxes = appliquerTaxes(sousTotal, commande);
        return appliquerRemises(avecTaxes, commande);
    }
    
    // Implémentation commune
    protected double calculeSousTotal(Commande commande) {
        if (commande == null || commande.getLignes() == null) {
            return 0.0;
        }
        return commande.getLignes().stream()
            .mapToDouble(ligne -> ligne.getVehicule().getPrix().doubleValue() * ligne.getQuantite())
            .sum();
    }
    
    // Méthodes abstraites à implémenter par les sous-classes
    protected abstract double appliquerTaxes(double sousTotal, Commande commande);
    protected abstract double appliquerRemises(double total, Commande commande);
    protected abstract double calculeTotalLivraison(double total, Commande commande);

}