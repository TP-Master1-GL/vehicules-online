package com.vehicules.patterns.factory;

import com.vehicules.entities.Commande;

public class CommandeFactory {
    
    public static final String TYPE_COMPTANT = "COMPTANT";
    public static final String TYPE_CREDIT = "CREDIT";
    
    
    public static Commande createCommande(String type) {
        // Validation
        if (type == null) {
            throw new IllegalArgumentException("Type de commande requis");
        }
        
        // Utilisation du pattern Factory Method 
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
     * Variante avec véhicule 
     */
    public static Commande createCommandePourVehicule(
            String type, com.vehicules.entities.Vehicule vehicule) {
        
        Commande commande = createCommande(type);
        commande.setVehicule(vehicule);
        commande.setMontant(vehicule.getPrix());
        
        return commande;
    }
    
    /**
     * Pour commandes avec crédit détaillé 
     */
    public static Commande createCommandeCredit(
            com.vehicules.entities.Vehicule vehicule,
            int dureeMois, double tauxInteret) {
        
        CommandeCreditCreator creator = new CommandeCreditCreator();
        return creator.creerCommandeAvecCredit(vehicule, dureeMois, tauxInteret);
    }
    
    /**
     * Pour commandes comptant avec remise 
     */
    public static Commande createCommandeComptantAvecRemise(
            com.vehicules.entities.Vehicule vehicule,
            double pourcentageRemise) {
        
        CommandeComptantCreator creator = new CommandeComptantCreator();
        return creator.creerCommandeAvecRemise(vehicule, pourcentageRemise);
    }
}
