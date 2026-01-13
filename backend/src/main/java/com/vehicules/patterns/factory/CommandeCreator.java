package com.vehicules.patterns.factory;

import com.vehicules.entities.Commande;
import com.vehicules.entities.EtatCommande;

/**
 * Fabrique abstraite selon le COURS
 * Adaptée aux besoins du PROJET
 */
public abstract class CommandeCreator {
    
    /**
     * Factory Method du cours
     * Adapté au projet : crée et initialise une commande
     */
    public Commande creerCommande() {
        // 1. Création via la factory method (cours)
        Commande commande = createCommande();
        
        // 2. Initialisation selon l'énoncé du projet
        initialiserSelonProjet(commande);
        
        return commande;
    }
    
    /**
     * Factory Method abstraite (COURS)
     */
    protected abstract Commande createCommande();
    
    /**
     * Initialisation selon les besoins du PROJET
     */
    protected void initialiserSelonProjet(Commande commande) {
        // État initial selon l'énoncé : "en cours"
        commande.setEtat(EtatCommande.EN_COURS);
        commande.setDateCreation(new java.util.Date());
        
        // Autres initialisations spécifiques au projet
        commande.setNumero(genererNumeroCommande());
        commande.setTaxe(0.0); // Calculée plus tard selon pays
    }
    
    /**
     * Génère un numéro de commande selon le projet
     */
    protected String genererNumeroCommande() {
        return "CMD-" + System.currentTimeMillis() + "-" + 
               (int)(Math.random() * 1000);
    }
    
    /**
     * Méthode utile pour le projet : créer avec véhicule
     */
    public Commande creerCommandeAvecVehicule(
            com.vehicules.entities.Vehicule vehicule) {
        Commande commande = creerCommande();
        commande.setVehicule(vehicule);
        commande.setMontant(vehicule.getPrix());
        return commande;
    }
}