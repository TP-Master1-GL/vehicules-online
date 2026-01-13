package com.vehicules.patterns.builder;

import com.vehicules.core.entities.Commande;

public class DirecteurDocuments {
    private DocumentBuilder builder;
    
    public DirecteurDocuments(DocumentBuilder builder) {
        this.builder = builder;
    }
    
    public void construireLiasseComplete(Commande commande) {
        builder.ajouterDemandeImmatriculation("Commande #" + commande.getId()); // Il faut les 3 paramètres présents dans la méthode telle qu'elle a été définie
        builder.ajouterCertificatCession("Véhicule commandé par " + commande.getClient().getNom()); // Il faut les 3 paramètres présents dans la méthode telle qu'elle a été définie
        builder.ajouterBonCommande("Montant total: " + commande.getMontantTotal() + "€"); // Il faut les 3 paramètres présents dans la méthode telle qu'elle a été définie
    }
    
    public void construireLiasseMinimale(Commande commande) {
        builder.ajouterBonCommande("Commande simplifiée #" + commande.getId()); // Il faut les 3 paramètres présents dans la méthode telle qu'elle a été définie
    }
}