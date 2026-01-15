package com.vehicules.patterns.bridge;

import java.util.HashMap;
import java.util.Map;

public class FormulaireCommande extends Formulaire {
    
    public FormulaireCommande(FormulaireImplementation implementation) {
        super(implementation);
    }
    
    @Override
    public void construire() {
        if (donnees == null) donnees = new HashMap<>();
        
        // Informations véhicule
        implementation.dessinerChampTexte("Modèle du véhicule", "modele", donnees.get("modele"));
        implementation.dessinerChampTexte("Numéro de série", "numeroSerie", donnees.get("numeroSerie"));
        
        // Type de paiement
        Map<String, String> typesPaiement = new HashMap<>();
        typesPaiement.put("comptant", "Paiement comptant");
        typesPaiement.put("credit", "Demande de crédit");
        implementation.dessinerChampSelect("Mode de paiement", "paiement", typesPaiement);
        
        // Options
        Map<String, String> optionsVehicule = new HashMap<>();
        optionsVehicule.put("gps", "GPS intégré");
        optionsVehicule.put("cuir", "Sièges en cuir");
        optionsVehicule.put("sport", "Sièges sport");
        optionsVehicule.put("toit", "Toit ouvrant");
        implementation.dessinerChampSelect("Options", "options", optionsVehicule);
        
        // Adresse livraison
        implementation.dessinerChampTexte("Adresse de livraison", "adresseLivraison", 
                                         donnees.get("adresseLivraison"));
        
        implementation.dessinerBouton("Confirmer la commande", "submit");
    }
    
    @Override
    public boolean valider() {
        if (donnees == null) return false;
        
        boolean modeleValide = donnees.get("modele") != null && !donnees.get("modele").trim().isEmpty();
        boolean paiementValide = donnees.get("paiement") != null && 
                                (donnees.get("paiement").equals("comptant") || 
                                 donnees.get("paiement").equals("credit"));
        
        return modeleValide && paiementValide;
    }
}