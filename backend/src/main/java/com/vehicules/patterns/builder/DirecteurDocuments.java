package com.vehicules.patterns.builder;

import com.vehicules.core.entities.Commande;

public class DirecteurDocuments {
    private DocumentBuilder builder;
    
    public DirecteurDocuments(DocumentBuilder builder) {
        this.builder = builder;
    }
    
    public void construireLiasseComplete(Commande commande) {
        // Pour la demande d'immatriculation
        String numeroSerie = "CMD-" + commande.getId();
        String clientNom = commande.getClient().getNom();
        String vehiculeModele = commande.getLignes() != null && !commande.getLignes().isEmpty()
            ? commande.getLignes().get(0).getVehicule().getModele()
            : "Modèle inconnu";

        builder.ajouterDemandeImmatriculation(numeroSerie, clientNom, vehiculeModele);

        // Pour le certificat de cession
        String vendeur = "AutoCorp";
        String acheteur = commande.getClient().getNom();
        String vehiculeInfo = vehiculeModele;

        builder.ajouterCertificatCession(vendeur, acheteur, vehiculeInfo);

        // Pour le bon de commande
        String commandeId = "CMD-" + commande.getId();
        String client = commande.getClient().getNom();
        double montant = commande.getMontantTotal() != null
            ? commande.getMontantTotal().doubleValue()
            : 0.0;

        builder.ajouterBonCommande(commandeId, client, montant);
    }

    public void construireLiasseMinimale(Commande commande) {
        String commandeId = "CMD-" + commande.getId();
        String client = commande.getClient().getNom();
        double montant = commande.getMontantTotal() != null
            ? commande.getMontantTotal().doubleValue()
            : 0.0;

        builder.ajouterBonCommande(commandeId, client, montant);
    }
}