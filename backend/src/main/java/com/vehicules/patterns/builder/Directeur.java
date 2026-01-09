package com.vehicules.patterns.builder;

public class Directeur {
    private DocumentBuilder builder;
    
    public Directeur(DocumentBuilder builder) {
        this.builder = builder;
    }
    
    public void changerBuilder(DocumentBuilder builder) {
        this.builder = builder;
    }
    
    // Construit une liasse complète
    public LiasseDocuments construireLiasseComplete(String numeroSerie, String client, String vehicule, 
                                                    String vendeur, String acheteur, 
                                                    String commandeId, double montant) {
        builder.ajouterDemandeImmatriculation(numeroSerie, client, vehicule);
        builder.ajouterCertificatCession(vendeur, acheteur, vehicule);
        builder.ajouterBonCommande(commandeId, client, montant);
        return (LiasseDocuments) builder.getLiasse();
    }
    
    // Construit une liasse minimale
    public LiasseDocuments construireLiasseMinimale(String numeroSerie, String client, String vehicule) {
        builder.ajouterDemandeImmatriculation(numeroSerie, client, vehicule);
        builder.ajouterBonCommande("CMD-" + System.currentTimeMillis(), client, 0.0);
        return (LiasseDocuments) builder.getLiasse();
    }
}