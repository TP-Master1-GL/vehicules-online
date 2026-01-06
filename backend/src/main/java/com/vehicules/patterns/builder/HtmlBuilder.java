package com.vehicules.patterns.builder;

public class HtmlBuilder implements DocumentBuilder {
    private LiasseHTML liasse;
    
    public HtmlBuilder() {
        this.reset();
    }
    
    @Override
    public void reset() {
        this.liasse = new LiasseHTML();
    }
    
    @Override
    public void ajouterDemandeImmatriculation(String numeroSerie, String clientNom, String vehiculeModele) {
        String contenu = "<strong>Numéro de série:</strong> " + numeroSerie + "<br>" +
                        "<strong>Client:</strong> " + clientNom + "<br>" +
                        "<strong>Véhicule:</strong> " + vehiculeModele + "<br>" +
                        "<strong>Date:</strong> " + java.time.LocalDate.now();
        liasse.ajouterSection("Demande d'immatriculation", contenu);
    }
    
    @Override
    public void ajouterCertificatCession(String vendeur, String acheteur, String vehiculeInfo) {
        String contenu = "<strong>Vendeur:</strong> " + vendeur + "<br>" +
                        "<strong>Acheteur:</strong> " + acheteur + "<br>" +
                        "<strong>Véhicule:</strong> " + vehiculeInfo + "<br>" +
                        "<strong>Date:</strong> " + java.time.LocalDate.now();
        liasse.ajouterSection("Certificat de cession", contenu);
    }
    
    @Override
    public void ajouterBonCommande(String commandeId, String client, double montant) {
        String contenu = "<strong>Numéro de commande:</strong> " + commandeId + "<br>" +
                        "<strong>Client:</strong> " + client + "<br>" +
                        "<strong>Montant:</strong> " + String.format("%.2f", montant) + " €<br>" +
                        "<strong>Date:</strong> " + java.time.LocalDate.now();
        liasse.ajouterSection("Bon de commande", contenu);
    }
    
    @Override
    public LiasseHTML getLiasse() {
        LiasseHTML result = this.liasse;
        this.reset();
        return result;
    }
}