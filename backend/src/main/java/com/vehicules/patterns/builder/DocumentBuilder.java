package com.vehicules.patterns.builder;

public interface DocumentBuilder {
    void ajouterDemandeImmatriculation(String numeroSerie, String clientNom, String vehiculeModele);
    void ajouterCertificatCession(String vendeur, String acheteur, String vehiculeInfo);
    void ajouterBonCommande(String commandeId, String client, double montant);
    Object getLiasse();
    void reset();
}