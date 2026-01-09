package com.vehicules.patterns.template;

public class CalculCommandeFR extends CalculCommandeTemplate {
    @Override
    protected double appliquerTaxes(double sousTotal) {
        // TVA 20% pour la France
        return sousTotal * 1.20;
    }
    
    @Override
    protected double appliquerRemises(double total) {
        // Pas de remise par défaut
        return total;
    }
}