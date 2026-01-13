package com.vehicules.patterns.factory;

import com.vehicules.entities.Commande;
import com.vehicules.entities.CommandeComptant;
import com.vehicules.entities.Vehicule;

/**
 * Fabrique concrète pour les commandes au COMPTANT
 */
public class CommandeComptantCreator extends CommandeCreator {
    
    @Override
    protected Commande createCommande() {
        return new CommandeComptant();
    }
    
    @Override
    protected void initialiserSelonProjet(Commande commande) {
        super.initialiserSelonProjet(commande);
        
        if (commande instanceof CommandeComptant) {
            CommandeComptant cmdComptant = (CommandeComptant) commande;
            
            // Spécificités "comptant" selon l'énoncé
            cmdComptant.setTypePaiement("COMPTANT");
            cmdComptant.setEstPaye(false); // Pas encore payé
            
            // Selon l'énoncé : gestion des taxes selon pays
            cmdComptant.setTauxTaxe(0.20); // Taux par défaut (20%)
        }
    }
    
    /**
     * Méthode spécifique PROJET : créer commande avec remise
     */
    public CommandeComptant creerCommandeAvecRemise(
            Vehicule vehicule, 
            Double pourcentageRemise) {
        
        if (vehicule == null) {
            throw new IllegalArgumentException("Le véhicule est requis");
        }
        
        CommandeComptant commande = (CommandeComptant) 
            creerCommandeAvecVehicule(vehicule);
        
        // Calcul remise selon projet
        Double montantBase = vehicule.getPrix();
        commande.setMontant(montantBase);
        commande.setRemise(pourcentageRemise != null ? pourcentageRemise : 0.0);
        
        return commande;
    }
    
    /**
     * Créer commande avec tous paramètres
     */
    public CommandeComptant creerCommandeComplete(
            String numero,
            Double montant,
            Vehicule vehicule,
            Double remise,
            String paysLivraison) {
        
        CommandeComptant commande = new CommandeComptant();
        commande.setNumero(numero != null ? numero : genererNumeroCommande());
        commande.setMontant(montant);
        commande.setVehicule(vehicule);
        commande.setRemise(remise != null ? remise : 0.0);
        commande.setPaysLivraison(paysLivraison);
        commande.calculerTaxe();
        
        return commande;
    }
}