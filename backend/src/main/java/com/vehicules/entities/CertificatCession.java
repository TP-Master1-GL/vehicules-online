package com.vehicules.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@DiscriminatorValue("CESSION")
public class CertificatCession extends Document {
    
    private String numeroSerie;
    
    @javax.persistence.Temporal(javax.persistence.TemporalType.DATE)
    private Date dateMiseCirculation;
    
    // Constructeur
    public CertificatCession() {}
    
    public CertificatCession(Commande commande, String numeroSerie, Date dateMiseCirculation) {
        super(commande);
        this.numeroSerie = numeroSerie;
        this.dateMiseCirculation = dateMiseCirculation;
        this.genererContent();
    }
    
    @Override
    public void genererContent() {
        StringBuilder sb = new StringBuilder();
        sb.append("CERTIFICAT DE CESSION\n");
        sb.append("=====================\n\n");
        
        if (getCommande() != null && getCommande().getClient() != null) {
            sb.append("Acheteur: ").append(getCommande().getClient().getNom()).append("\n");
            sb.append("Email: ").append(getCommande().getClient().getEmail()).append("\n\n");
        }
        
        sb.append("Numéro de série: ").append(numeroSerie).append("\n");
        sb.append("Date mise en circulation: ").append(dateMiseCirculation).append("\n\n");
        
        sb.append("Le véhicule décrit ci-dessus est cédé en l'état.\n");
        sb.append("Fait le: ").append(new Date()).append("\n\n");
        sb.append("Signature vendeur: _________________\n");
        sb.append("Signature acheteur: ________________");
        
        setContent(sb.toString());
        setType("CESSION");
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
}