package com.vehicules.entities;

import javax.persistence.Entity;

@Entity
public class ScooterEssence extends Vehicule {
    
    private double capaciteReservoir; // en litres
    private String typeCarburant; // SP95, SP98, etc.
    
    // Constructeurs
    public ScooterEssence() {
        super();
    }
    
    public ScooterEssence(String modele, double prix, double capaciteReservoir, String typeCarburant) {
        super(modele, prix);
        this.capaciteReservoir = capaciteReservoir;
        this.typeCarburant = typeCarburant;
    }
    
    // Getters et Setters
    public double getCapaciteReservoir() {
        return capaciteReservoir;
    }
    
    public void setCapaciteReservoir(double capaciteReservoir) {
        this.capaciteReservoir = capaciteReservoir;
    }
    
    public String getTypeCarburant() {
        return typeCarburant;
    }
    
    public void setTypeCarburant(String typeCarburant) {
        this.typeCarburant = typeCarburant;
    }
}