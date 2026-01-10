package com.vehicules.patterns.bridge;

import java.util.Map;

public abstract class Formulaire {
    protected FormulaireImplementation implementation;
    protected Map<String, String> donnees;
    
    public Formulaire(FormulaireImplementation implementation) {
        this.implementation = implementation;
    }
    
    public void setImplementation(FormulaireImplementation implementation) {
        this.implementation = implementation;
    }
    
    public void setDonnees(Map<String, String> donnees) {
        this.donnees = donnees;
    }
    
    public abstract void construire();
    public abstract boolean valider();
    
    public String afficher() {
        return implementation.getRenduComplet();
    }
    
    public void reset() {
        implementation.reset();
    }
}