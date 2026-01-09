package com.vehicules.patterns.template;

public abstract class CalculCommandeTemplate {
    // Template Method
    public final double calculerMontant(double sousTotal) {
        double avecTaxes = appliquerTaxes(sousTotal);
        double avecRemises = appliquerRemises(avecTaxes);
        return avecRemises;
    }
    
    protected abstract double appliquerTaxes(double sousTotal);
    protected abstract double appliquerRemises(double total);
    
    protected double calculerSousTotal(double prixBase, int quantite) {
        return prixBase * quantite;
    }
}