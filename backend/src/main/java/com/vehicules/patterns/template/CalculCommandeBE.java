package com.vehicules.patterns.template;

public class CalculCommandeBE extends CalculCommandeTemplate {
    @Override
    protected double appliquerTaxes(double sousTotal) {
        // TVA 21% pour la Belgique
        return sousTotal * 1.21;
    }
    
    @Override
    protected double appliquerRemises(double total) {
        // Remise de 5% pour commandes > 10000€
        if (total > 10000) {
            return total * 0.95;
        }
        return total;
    }
}