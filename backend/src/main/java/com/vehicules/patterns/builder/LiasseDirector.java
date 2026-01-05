package com.vehicules.patterns.builder;

public class LiasseDirector {
    private DocumentBuilder builder;
    
    public void setBuilder(DocumentBuilder builder) {
        this.builder = builder;
    }
    
    public void constructLiasseComplete(String orderId) {
        if (builder == null) {
            throw new IllegalStateException("Builder non défini");
        }
        
        builder.ajouterDemandeImmatriculation(orderId);
        builder.ajouterCertificatCession(orderId);
        builder.ajouterBonCommande(orderId);
    }
    
    public void constructLiasseMinimale(String orderId) {
        if (builder == null) {
            throw new IllegalStateException("Builder non défini");
        }
        
        // Pour une liasse minimale, on ne génère que le bon de commande
        builder.ajouterBonCommande(orderId);
    }
}