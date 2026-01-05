
package com.vehicules.patterns.builder;

public interface DocumentBuilder {
    void ajouterDemandeImmatriculation(String orderId);
    void ajouterCertificatCession(String orderId);
    void ajouterBonCommande(String orderId);
    LiasseDocuments getLiasse();
}