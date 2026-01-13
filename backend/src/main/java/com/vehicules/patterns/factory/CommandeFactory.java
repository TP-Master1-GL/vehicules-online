package com.vehicules.patterns.factory;

import com.vehicules.entities.Commande;

/**
 * Façade pour utiliser facilement les fabriques
 * Conforme à l'ÉNONCÉ qui demande une façon simple de créer
 */
public class CommandeFactory {
    
    // Constantes selon l'énoncé
    public static final String TYPE_COMPTANT = "COMPTANT";
    public static final String TYPE_CREDIT = "CREDIT";
    
    /**
     * Méthode principale selon l'ÉNONCÉ
     * Utilise INTERNAMENT le pattern du COURS
     */
    public static Commande createCommande(String type) {
        // Validation
        if (type == null) {
            throw new IllegalArgumentException("Type de commande requis");
        }
        
        // Utilisation du pattern Factory Method du COURS
        CommandeCreator creator = null;
        
        switch (type.toUpperCase()) {
            case TYPE_COMPTANT:
                creator = new CommandeComptantCreator();
                break;
                
            case TYPE_CREDIT:
                creator = new CommandeCreditCreator();
                break;
                
            default:
                throw new IllegalArgumentException(
                    "Type '" + type + "' non supporté. " +
                    "Types: " + TYPE_COMPTANT + ", " + TYPE_CREDIT
                );
        }
        
        return creator.creerCommande();
    }
    
    /**
     * Variante avec véhicule (selon l'énoncé)
     */
    public static Commande createCommandePourVehicule(
            String type, com.vehicules.entities.Vehicule vehicule) {
        
        Commande commande = createCommande(type);
        commande.setVehicule(vehicule);
        commande.setMontant(vehicule.getPrix());
        
        return commande;
    }
    
    /**
     * Pour commandes avec crédit détaillé (énoncé)
     */
    public static Commande createCommandeCredit(
            com.vehicules.entities.Vehicule vehicule,
            int dureeMois, double tauxInteret) {
        
        CommandeCreditCreator creator = new CommandeCreditCreator();
        return creator.creerCommandeAvecCredit(vehicule, dureeMois, tauxInteret);
    }
    
    /**
     * Pour commandes comptant avec remise (énoncé)
     */
    public static Commande createCommandeComptantAvecRemise(
            com.vehicules.entities.Vehicule vehicule,
            double pourcentageRemise) {
        
        CommandeComptantCreator creator = new CommandeComptantCreator();
        return creator.creerCommandeAvecRemise(vehicule, pourcentageRemise);
    }
}
