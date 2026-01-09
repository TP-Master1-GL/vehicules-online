package com.vehicules.controllers;

import com.vehicules.patterns.bridge.*;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/formulaires")
@CrossOrigin(origins = "*")
public class FormulaireController {
    
    @PostMapping("/generer")
    public Map<String, Object> genererFormulaire(@RequestBody FormulaireRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Choisir l'implémentation
            FormulaireImplementation implementation;
            if ("html".equalsIgnoreCase(request.getFormat())) {
                implementation = new HtmlFormImplementation();
            } else if ("widget".equalsIgnoreCase(request.getFormat())) {
                implementation = new WidgetFormImplementation();
            } else {
                throw new IllegalArgumentException("Format non supporté: " + request.getFormat());
            }
            
            // Créer le formulaire approprié
            Formulaire formulaire;
            if ("inscription".equalsIgnoreCase(request.getType())) {
                formulaire = new FormulaireInscription(implementation);
            } else if ("commande".equalsIgnoreCase(request.getType())) {
                formulaire = new FormulaireCommande(implementation);
            } else {
                throw new IllegalArgumentException("Type de formulaire non supporté: " + request.getType());
            }
            
            // Construire et afficher
            formulaire.setDonnees(request.getDonnees());
            formulaire.construire();
            
            // Validation
            boolean valide = formulaire.valider();
            
            // Préparer la réponse
            response.put("success", true);
            response.put("type", request.getType());
            response.put("format", request.getFormat());
            response.put("valide", valide);
            response.put("rendu", formulaire.afficher());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @GetMapping("/types")
    public Map<String, Object> getTypesFormulaires() {
        Map<String, Object> response = new HashMap<>();
        response.put("types", new String[]{"inscription", "commande"});
        response.put("formats", new String[]{"html", "widget"});
        return response;
    }
    
    // Classe pour la requête
    public static class FormulaireRequest {
        private String type; // inscription ou commande
        private String format; // html ou widget
        private Map<String, String> donnees;
        
        // Getters et setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getFormat() { return format; }
        public void setFormat(String format) { this.format = format; }
        public Map<String, String> getDonnees() { return donnees; }
        public void setDonnees(Map<String, String> donnees) { this.donnees = donnees; }
    }
}