package com.vehicules.entities;

import javax.persistence.Entity;

@Entity
public class AutomobileEssence extends Vehicule {
    
    private int puissance; // en chevaux
    private double consommation; // L/100km
    
    // Constructeurs
    public AutomobileEssence() {
        super();
    }
    
    public AutomobileEssence(String modele, double prix, int puissance, double consommation) {
        super(modele, prix);
        this.puissance = puissance;
        this.consommation = consommation;
    }
    
    // Getters et Setters
    public int getPuissance() {
        return puissance;
    }
    
    public void setPuissance(int puissance) {
        this.puissance = puissance;
    }
    
    public double getConsommation() {
        return consommation;
    }
    
    public void setConsommation(double consommation) {
        this.consommation = consommation;
    }
}