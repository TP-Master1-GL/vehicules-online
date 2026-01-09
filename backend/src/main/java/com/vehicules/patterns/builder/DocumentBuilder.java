package com.vehicules.patterns.builder;

import java.util.List;

public interface DocumentBuilder {
    void ajouterDemandeImmatriculation(String contenu);
    void ajouterCertificatCession(String contenu);
    void ajouterBonCommande(String contenu);
    List<String> getLiasse();
}