package com.vehicules.entities;

import javax.persistence.Entity;

@Entity
public class ScooterElectrique extends Vehicule {
    
    private int autonomie; // en km
    private double vitesseMax; // en km/h
    
    // Constructeurs
    public ScooterElectrique() {
        super();
    }
    
    public ScooterElectrique(String modele, double prix, int autonomie, double vitesseMax) {
        super(modele, prix);
        this.autonomie = autonomie;
        this.vitesseMax = vitesseMax;
    }
    
    // Getters et Setters
    public int getAutonomie() {
        return autonomie;
    }
    
    public void setAutonomie(int autonomie) {
        this.autonomie = autonomie;
    }
    
    public double getVitesseMax() {
        return vitesseMax;
    }
    
    public void setVitesseMax(double vitesseMax) {
        this.vitesseMax = vitesseMax;
    }
}