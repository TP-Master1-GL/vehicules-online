package com.vehicules.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@DiscriminatorValue("IMMATRICULATION")
public class DemandeImmatriculation extends Document {
    
    private String numeroSerie;
    
    @javax.persistence.Temporal(javax.persistence.TemporalType.DATE)
    private Date dateMiseCirculation;
    
    // Constructeurs
    public DemandeImmatriculation() {
        super();
    }
    
    public DemandeImmatriculation(Commande commande, String numeroSerie, Date dateMiseCirculation) {
        super(commande);
        this.numeroSerie = numeroSerie;
        this.dateMiseCirculation = dateMiseCirculation;
        this.genererContenu();
    }
    
    // Implémentation de la méthode abstraite
    @Override
    public void genererContenu() {
        StringBuilder sb = new StringBuilder();
        sb.append("DEMANDE D'IMMATRICULATION\n");
        sb.append("==========================\n\n");
        
        sb.append("DEMANDEUR:\n");
        if (getCommande() != null && getCommande().getClient() != null) {
            Client demandeur = getCommande().getClient();
            sb.append("Nom: ").append(demandeur.getNom()).append("\n");
            sb.append("Prénom: ").append(demandeur.getPrenom()).append("\n");
            sb.append("Date de naissance: ").append(demandeur.getDateNaissance()).append("\n");
            sb.append("Lieu de naissance: ").append(demandeur.getLieuNaissance()).append("\n");
            sb.append("Adresse: ").append(demandeur.getAdresse()).append("\n");
            sb.append("Code postal: ").append(demandeur.getCodePostal()).append("\n");
            sb.append("Ville: ").append(demandeur.getVille()).append("\n");
            sb.append("Téléphone: ").append(demandeur.getTelephone()).append("\n");
            sb.append("Email: ").append(demandeur.getEmail()).append("\n\n");
        }
        
        sb.append("INFORMATIONS DU VÉHICULE:\n");
        if (getCommande() != null && !getCommande().getLignes().isEmpty()) {
            LigneCommande ligne = getCommande().getLignes().get(0);
            if (ligne.getVehicule() != null) {
                Vehicule vehicule = ligne.getVehicule();
                sb.append("Marque: ").append(vehicule.getMarque()).append("\n");
                sb.append("Modèle: ").append(vehicule.getModele()).append("\n");
                sb.append("Type: ").append(vehicule.getType()).append("\n");
                sb.append("Couleur: ").append(vehicule.getCouleur()).append("\n");
                sb.append("Type d'énergie: ").append(vehicule.getTypeEnergie()).append("\n");
                sb.append("Numéro de châssis/VIN: ").append(vehicule.getNumeroChassis()).append("\n");
            }
        }
        
        sb.append("Numéro de série: ").append(numeroSerie).append("\n");
        sb.append("Date de première mise en circulation: ").append(dateMiseCirculation).append("\n\n");
        
        sb.append("DOCUMENTS FOURNIS:\n");
        sb.append("[ ] Certificat de cession\n");
        sb.append("[ ] Facture d'achat\n");
        sb.append("[ ] Certificat de conformité\n");
        sb.append("[ ] Quitus fiscal\n");
        sb.append("[ ] Attestation d'assurance\n");
        sb.append("[ ] Pièce d'identité\n");
        sb.append("[ ] Justificatif de domicile\n\n");
        
        sb.append("CHOIX DE LA PLAQUE:\n");
        sb.append("Type de plaque: [ ] Standard  [ ] Personnalisée\n");
        if (getCommande() != null && getCommande().getClient() != null) {
            sb.append("Département souhaité: ").append(getCommande().getClient().getCodePostal().substring(0, 2)).append("\n\n");
        }
        
        sb.append("DÉCLARATION SUR L'HONNEUR:\n");
        sb.append("Je soussigné(e) ");
        if (getCommande() != null && getCommande().getClient() != null) {
            sb.append(getCommande().getClient().getNom()).append(" ").append(getCommande().getClient().getPrenom());
        }
        sb.append(",\ndéclare sur l'honneur que les informations fournies dans la présente demande sont exactes et complètes.\n");
        sb.append("Je m'engage à informer le service des immatriculations de tout changement.\n\n");
        
        sb.append("Fait à _________________________________, le ").append(new Date()).append("\n\n");
        
        sb.append("Signature du demandeur:\n");
        sb.append("__________________________\n\n");
        
        sb.append("RÉSERVÉ À L'ADMINISTRATION\n");
        sb.append("Date de réception: _______________\n");
        sb.append("Numéro de dossier: _______________\n");
        sb.append("Agent instructeur: _______________\n");
        sb.append("Date de décision: _______________\n");
        sb.append("Décision: [ ] Acceptée  [ ] Rejetée\n");
        sb.append("Motif du rejet: ____________________________________\n");
        sb.append("Plaque attribuée: _______________\n");
        sb.append("Carte grise numéro: _______________\n");
        
        setContent(sb.toString());
        setType("DEMANDE_IMMATRICULATION");
    }
    
    // Getters et Setters
    public String getNumeroSerie() {
        return numeroSerie;
    }
    
    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }
    
    public Date getDateMiseCirculation() {
        return dateMiseCirculation;
    }
    
    public void setDateMiseCirculation(Date dateMiseCirculation) {
        this.dateMiseCirculation = dateMiseCirculation;
    }
    
    @Override
    public String toString() {
        return "DemandeImmatriculation{" +
               "id='" + getId() + '\'' +
               ", numeroSerie='" + numeroSerie + '\'' +
               ", dateMiseCirculation=" + dateMiseCirculation +
               ", type='" + getType() + '\'' +
               '}';
    }
}