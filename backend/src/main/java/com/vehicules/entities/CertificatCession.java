package com.vehicules.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@DiscriminatorValue("CESSION")
public class CertificatCession extends Document {
    
    private String ancienProprietaire;
    
    @javax.persistence.Temporal(javax.persistence.TemporalType.DATE)
    private Date dateCession;
    
    // Constructeurs
    public CertificatCession() {
        super();
    }
    
    public CertificatCession(Commande commande, String ancienProprietaire, Date dateCession) {
        super(commande);
        this.ancienProprietaire = ancienProprietaire;
        this.dateCession = dateCession;
        this.genererContenu();
    }
    
    // Implémentation de la méthode abstraite
    @Override
    public void genererContenu() {
        StringBuilder sb = new StringBuilder();
        sb.append("CERTIFICAT DE CESSION DE VÉHICULE\n");
        sb.append("==================================\n\n");
        
        // Informations sur le véhicule
        if (getCommande() != null && !getCommande().getLignes().isEmpty()) {
            LigneCommande ligne = getCommande().getLignes().get(0);
            if (ligne.getVehicule() != null) {
                Vehicule vehicule = ligne.getVehicule();
                sb.append("VÉHICULE CÉDÉ:\n");
                sb.append("Marque: ").append(vehicule.getMarque()).append("\n");
                sb.append("Modèle: ").append(vehicule.getModele()).append("\n");
                sb.append("Type: ").append(vehicule.getType()).append("\n");
                sb.append("Immatriculation: ").append(vehicule.getImmatriculation()).append("\n\n");
            }
        }
        
        // Informations sur les parties
        sb.append("INFORMATIONS DES PARTIES:\n");
        sb.append("Ancien propriétaire: ").append(ancienProprietaire).append("\n");
        
        if (getCommande() != null && getCommande().getClient() != null) {
            Client nouveauProprietaire = getCommande().getClient();
            sb.append("Nouveau propriétaire: ").append(nouveauProprietaire.getNom())
              .append(" ").append(nouveauProprietaire.getPrenom()).append("\n");
            sb.append("Adresse: ").append(nouveauProprietaire.getAdresse()).append("\n");
            sb.append("Téléphone: ").append(nouveauProprietaire.getTelephone()).append("\n");
        }
        
        sb.append("\nDÉTAILS DE LA CESSION:\n");
        sb.append("Date de cession: ").append(dateCession).append("\n");
        
        if (getCommande() != null) {
            sb.append("Prix de cession: ").append(String.format("%.2f €", getCommande().getMontantTotal())).append("\n");
            sb.append("Numéro de transaction: ").append(getCommande().getId()).append("\n");
        }
        
        sb.append("\nDÉCLARATIONS:\n");
        sb.append("1. L'ancien propriétaire déclare être légalement propriétaire du véhicule.\n");
        sb.append("2. Le véhicule est cédé libre de tout privilège ou hypothèque.\n");
        sb.append("3. L'acheteur accepte le véhicule en l'état.\n");
        
        sb.append("\nSIGNATURES:\n\n");
        sb.append("__________________________________\n");
        sb.append("Signature de l'ancien propriétaire\n");
        sb.append("Nom: ").append(ancienProprietaire).append("\n\n");
        
        if (getCommande() != null && getCommande().getClient() != null) {
            sb.append("__________________________________\n");
            sb.append("Signature du nouveau propriétaire\n");
            sb.append("Nom: ").append(getCommande().getClient().getNom()).append(" ")
              .append(getCommande().getClient().getPrenom()).append("\n\n");
        }
        
        sb.append("Date d'établissement: ").append(new Date()).append("\n");
        
        setContent(sb.toString());
        setType("CERTIFICAT_CESSION");
    }
    
    // Getters et Setters
    public String getAncienProprietaire() {
        return ancienProprietaire;
    }
    
    public void setAncienProprietaire(String ancienProprietaire) {
        this.ancienProprietaire = ancienProprietaire;
    }
    
    public Date getDateCession() {
        return dateCession;
    }
    
    public void setDateCession(Date dateCession) {
        this.dateCession = dateCession;
    }
    
    @Override
    public String toString() {
        return "CertificatCession{" +
               "id='" + getId() + '\'' +
               ", ancienProprietaire='" + ancienProprietaire + '\'' +
               ", dateCession=" + dateCession +
               ", type='" + getType() + '\'' +
               '}';
    }
}