package com.vehicules.entities;

import javax.persistence.Entity;

@Entity
public class AutomobileElectrique extends Vehicule {
    
    private int autonomie; // en km
    private int tempsRecharge; // en heures
    
    // Constructeurs
    public AutomobileElectrique() {
        super();
    }
    
    public AutomobileElectrique(String modele, double prix, int autonomie, int tempsRecharge) {
        super(modele, prix);
        this.autonomie = autonomie;
        this.tempsRecharge = tempsRecharge;
    }
    
    // Getters et Setters
    public int getAutonomie() {
        return autonomie;
    }
    
    public void setAutonomie(int autonomie) {
        this.autonomie = autonomie;
    }
    
    public int getTempsRecharge() {
        return tempsRecharge;
    }
    
    public void setTempsRecharge(int tempsRecharge) {
        this.tempsRecharge = tempsRecharge;
    }
}