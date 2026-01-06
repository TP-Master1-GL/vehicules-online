package com.vehicules.patterns.bridge;

import java.util.HashMap;
import java.util.Map;

public class FormulaireInscription extends Formulaire {
    
    public FormulaireInscription(FormulaireImplementation implementation) {
        super(implementation);
    }
    
    @Override
    public void construire() {
        if (donnees == null) donnees = new HashMap<>();
        
        // Champs du formulaire d'inscription
        implementation.dessinerChampTexte("Nom complet", "nom", donnees.get("nom"));
        implementation.dessinerChampEmail("Adresse email", "email", donnees.get("email"));
        implementation.dessinerChampTexte("Téléphone", "telephone", donnees.get("telephone"));
        implementation.dessinerChampTexte("Adresse", "adresse", donnees.get("adresse"));
        
        // Type de client
        Map<String, String> typesClient = new HashMap<>();
        typesClient.put("particulier", "Particulier");
        typesClient.put("societe", "Société");
        implementation.dessinerChampSelect("Type de client", "typeClient", typesClient);
        
        implementation.dessinerBouton("S'inscrire", "submit");
    }
    
    @Override
    public boolean valider() {
        // Validation basique
        if (donnees == null) return false;
        
        boolean nomValide = donnees.get("nom") != null && !donnees.get("nom").trim().isEmpty();
        boolean emailValide = donnees.get("email") != null && donnees.get("email").contains("@");
        
        return nomValide && emailValide;
    }
}