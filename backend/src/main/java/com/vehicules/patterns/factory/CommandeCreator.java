package com.vehicules.patterns.factory;

import com.vehicules.entities.Commande;
import com.vehicules.entities.EtatCommande;


public abstract class CommandeCreator {
    
    
    public Commande creerCommande() {
        Commande commande = createCommande();
        
        initialiserSelonProjet(commande);
        
        return commande;
    }
    
    /**
     * Factory Method abstraite 
     */
    protected abstract Commande createCommande();
    
    
    protected void initialiserSelonProjet(Commande commande) {
        commande.setEtat(EtatCommande.EN_COURS);
        commande.setDateCreation(new java.util.Date());
        
        commande.setNumero(genererNumeroCommande());
        commande.setTaxe(0.0); // Calculée plus tard selon pays
    }
    
    
    protected String genererNumeroCommande() {
        return "CMD-" + System.currentTimeMillis() + "-" + 
               (int)(Math.random() * 1000);
    }
    
    
    public Commande creerCommandeAvecVehicule(
            com.vehicules.entities.Vehicule vehicule) {
        Commande commande = creerCommande();
        commande.setVehicule(vehicule);
        commande.setMontant(vehicule.getPrix());
        return commande;
    }
}