package com.vehicules.entities;

import javax.persistence.Entity;

@Entity
public class CommandeCredit extends Commande {
    
    private int dureeMois;
    private double tauxInteret;
    
    // Constructeurs
    public CommandeCredit() {
        super();
    }
    
    public CommandeCredit(String numero, double montant, int dureeMois, double tauxInteret) {
        super(numero, montant);
        this.dureeMois = dureeMois;
        this.tauxInteret = tauxInteret;
    }
    
    // Getters et Setters
    public int getDureeMois() {
        return dureeMois;
    }
    
    public void setDureeMois(int dureeMois) {
        this.dureeMois = dureeMois;
    }
    
    public double getTauxInteret() {
        return tauxInteret;
    }
    
    public void setTauxInteret(double tauxInteret) {
        this.tauxInteret = tauxInteret;
    }
}