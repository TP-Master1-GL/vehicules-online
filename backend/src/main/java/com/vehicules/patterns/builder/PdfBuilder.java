package com.vehicules.patterns.builder;

public class PdfBuilder implements DocumentBuilder {
    private LiassePDF liasse;
    
    public PdfBuilder() {
        this.reset();
    }
    
    @Override
    public void reset() {
        this.liasse = new LiassePDF();
    }
    
    @Override
    public void ajouterDemandeImmatriculation(String numeroSerie, String clientNom, String vehiculeModele) {
        String contenu = "Demande d'immatriculation\n" +
                        "Numéro de série: " + numeroSerie + "\n" +
                        "Client: " + clientNom + "\n" +
                        "Véhicule: " + vehiculeModele + "\n" +
                        "Date: " + java.time.LocalDate.now() + "\n" +
                        "Signature: ________________";
        liasse.ajouterPage("DEMANDE D'IMMATRICULATION", contenu);
    }
    
    @Override
    public void ajouterCertificatCession(String vendeur, String acheteur, String vehiculeInfo) {
        String contenu = "CERTIFICAT DE CESSION\n" +
                        "Vendeur: " + vendeur + "\n" +
                        "Acheteur: " + acheteur + "\n" +
                        "Véhicule: " + vehiculeInfo + "\n" +
                        "Date de cession: " + java.time.LocalDate.now() + "\n" +
                        "Kilométrage: ________ km\n" +
                        "Prix: ________ €";
        liasse.ajouterPage("CERTIFICAT DE CESSION", contenu);
    }
    
    @Override
    public void ajouterBonCommande(String commandeId, String client, double montant) {
        String contenu = "BON DE COMMANDE N°" + commandeId + "\n" +
                        "Client: " + client + "\n" +
                        "Montant total: " + String.format("%.2f", montant) + " €\n" +
                        "Date de commande: " + java.time.LocalDate.now() + "\n" +
                        "Mode de paiement: ________\n" +
                        "Livraison prévue: ________";
        liasse.ajouterPage("BON DE COMMANDE", contenu);
    }
    
    @Override
    public LiassePDF getLiasse() {
        LiassePDF result = this.liasse;
        this.reset();
        return result;
    }
}