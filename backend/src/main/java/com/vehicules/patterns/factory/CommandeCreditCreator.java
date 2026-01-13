package com.vehicules.patterns.factory;

import com.vehicules.entities.Commande;
import com.vehicules.entities.CommandeCredit;
import com.vehicules.entities.Vehicule;
import java.util.Date;

/**
 * Fabrique concrète pour les commandes avec CRÉDIT
 */
public class CommandeCreditCreator extends CommandeCreator {
    
    @Override
    protected Commande createCommande() {
        return new CommandeCredit();
    }
    
    @Override
    protected void initialiserSelonProjet(Commande commande) {
        super.initialiserSelonProjet(commande);
        
        if (commande instanceof CommandeCredit) {
            CommandeCredit cmdCredit = (CommandeCredit) commande;
            
            // Spécificités "crédit" selon l'énoncé
            cmdCredit.setTypePaiement("CREDIT");
            cmdCredit.setEstPaye(false);
            cmdCredit.setCreditApprouve(false); // À approuver
            cmdCredit.setDemandeCreditSoumise(true); // Soumise automatiquement
            
            // Calcul échéance selon projet
            Date now = new Date();
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(now);
            cal.add(java.util.Calendar.MONTH, 1);
            cmdCredit.setDateEcheance(cal.getTime());
            
            // Taux par défaut selon projet
            cmdCredit.setTauxInteret(3.5); // 3.5% annuel
            cmdCredit.setDureeMois(48); // 48 mois par défaut
            cmdCredit.calculerMensualite();
        }
    }
    
    /**
     * Méthode spécifique PROJET : créer commande avec crédit détaillé
     */
    public CommandeCredit creerCommandeAvecCredit(
            Vehicule vehicule,
            Integer dureeMois, 
            Double tauxInteret) {
        
        if (vehicule == null) {
            throw new IllegalArgumentException("Le véhicule est requis");
        }
        
        CommandeCredit commande = (CommandeCredit) 
            creerCommandeAvecVehicule(vehicule);
        
        commande.setDureeMois(dureeMois != null ? dureeMois : 48);
        commande.setTauxInteret(tauxInteret != null ? tauxInteret : 3.5);
        commande.calculerMensualite();
        
        // Selon l'énoncé : demande de crédit à approuver
        commande.setDemandeCreditSoumise(true);
        
        return commande;
    }
    
    /**
     * Créer commande avec tous paramètres
     */
    public CommandeCredit creerCommandeComplete(
            String numero,
            Double montant,
            Vehicule vehicule,
            Integer dureeMois,
            Double tauxInteret,
            String paysLivraison) {
        
        CommandeCredit commande = new CommandeCredit();
        commande.setNumero(numero != null ? numero : genererNumeroCommande());
        commande.setMontant(montant);
        commande.setVehicule(vehicule);
        commande.setDureeMois(dureeMois != null ? dureeMois : 48);
        commande.setTauxInteret(tauxInteret != null ? tauxInteret : 3.5);
        commande.setPaysLivraison(paysLivraison);
        commande.calculerMensualite();
        commande.calculerTaxe();
        commande.setDemandeCreditSoumise(true);
        
        return commande;
    }
}