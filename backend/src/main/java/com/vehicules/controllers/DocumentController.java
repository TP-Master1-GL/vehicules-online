package com.vehicules.controllers;

import com.vehicules.patterns.builder.*;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/documents")
@CrossOrigin(origins = "*")
public class DocumentController {
    
    @PostMapping("/generate")
    public Map<String, Object> generateDocuments(@RequestBody DocumentRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Choisir le builder en fonction du format
            DocumentBuilder builder;
            if ("pdf".equalsIgnoreCase(request.getFormat())) {
                builder = new PdfBuilder();
            } else {
                builder = new HtmlBuilder();
            }
            
            // Utiliser le directeur
            Directeur directeur = new Directeur(builder);
            
            // Construire la liasse
            LiasseDocuments liasse = directeur.construireLiasseComplete(
                request.getNumeroSerie(),
                request.getClientNom(),
                request.getVehiculeModele(),
                "Concession XYZ", // Vendeur par défaut
                request.getClientNom(),
                "CMD-" + System.currentTimeMillis(),
                request.getMontant()
            );
            
            // Préparer la réponse
            response.put("success", true);
            response.put("type", liasse.getType());
            response.put("contenu", liasse.getContenu());
            response.put("timestamp", System.currentTimeMillis());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    @PostMapping("/generate-minimal")
    public Map<String, Object> generateMinimalDocument(@RequestBody MinimalDocumentRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            DocumentBuilder builder = "pdf".equalsIgnoreCase(request.getFormat()) 
                ? new PdfBuilder() 
                : new HtmlBuilder();
            
            Directeur directeur = new Directeur(builder);
            LiasseDocuments liasse = directeur.construireLiasseMinimale(
                request.getNumeroSerie(),
                request.getClientNom(),
                request.getVehiculeModele()
            );
            
            response.put("success", true);
            response.put("type", liasse.getType());
            response.put("contenu", liasse.getContenu());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        
        return response;
    }
    
    // Classes internes pour les requêtes
    public static class DocumentRequest {
        private String format; // pdf ou html
        private String numeroSerie;
        private String clientNom;
        private String vehiculeModele;
        private double montant;
        
        // Getters et setters
        public String getFormat() { return format; }
        public void setFormat(String format) { this.format = format; }
        public String getNumeroSerie() { return numeroSerie; }
        public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }
        public String getClientNom() { return clientNom; }
        public void setClientNom(String clientNom) { this.clientNom = clientNom; }
        public String getVehiculeModele() { return vehiculeModele; }
        public void setVehiculeModele(String vehiculeModele) { this.vehiculeModele = vehiculeModele; }
        public double getMontant() { return montant; }
        public void setMontant(double montant) { this.montant = montant; }
    }
    
    public static class MinimalDocumentRequest {
        private String format;
        private String numeroSerie;
        private String clientNom;
        private String vehiculeModele;
        
        // Getters et setters
        public String getFormat() { return format; }
        public void setFormat(String format) { this.format = format; }
        public String getNumeroSerie() { return numeroSerie; }
        public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }
        public String getClientNom() { return clientNom; }
        public void setClientNom(String clientNom) { this.clientNom = clientNom; }
        public String getVehiculeModele() { return vehiculeModele; }
        public void setVehiculeModele(String vehiculeModele) { this.vehiculeModele = vehiculeModele; }
    }
}