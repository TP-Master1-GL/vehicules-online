package com.vehicules.entities;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@DiscriminatorValue("BON_COMMANDE")
public class BonCommande extends Document {
    
    private double montantTotal;
    
    @javax.persistence.Temporal(javax.persistence.TemporalType.DATE)
    private Date dateLivraisonPrevue;
    
    // Constructeur
    public BonCommande() {}
    
    public BonCommande(Commande commande, Date dateLivraisonPrevue) {
        super(commande);
        this.dateLivraisonPrevue = dateLivraisonPrevue;
        if (commande != null) {
            this.montantTotal = commande.calculerMontant();
        }
        this.genererContent();
    }
    
    @Override
    public void genererContent() {
        StringBuilder sb = new StringBuilder();
        sb.append("BON DE COMMANDE\n");
        sb.append("===============\n\n");
        
        if (getCommande() != null) {
            sb.append("Commande N°: ").append(getCommande().getId()).append("\n");
            sb.append("Date: ").append(getCommande().getDate()).append("\n");
            
            if (getCommande().getClient() != null) {
                sb.append("Client: ").append(getCommande().getClient().getNom()).append("\n");
            }
            
            sb.append("Montant total: ").append(montantTotal).append(" €\n");
            sb.append("Date livraison prévue: ").append(dateLivraisonPrevue).append("\n\n");
            
            sb.append("Détail de la commande:\n");
            sb.append("---------------------\n");
            
            if (getCommande().getLignes() != null) {
                for (LigneCommande ligne : getCommande().getLignes()) {
                    if (ligne.getVehicule() != null) {
                        sb.append("- ").append(ligne.getVehicule().getMarque())
                          .append(" ").append(ligne.getVehicule().getModele())
                          .append(" x").append(ligne.getQuantite())
                          .append(" : ").append(ligne.calculerSousTotal()).append(" €\n");
                    }
                }
            }
        }
        
        sb.append("\nSignature: _________________\n");
        sb.append("Date: ").append(new Date());
        
        setContent(sb.toString());
        setType("BON_COMMANDE");
    }
    
    // Getters et Setters
    public double getMontantTotal() {
        return montantTotal;
    }
    
    public void setMontantTotal(double montantTotal) {
        this.montantTotal = montantTotal;
    }
    
    public Date getDateLivraisonPrevue() {
        return dateLivraisonPrevue;
    }
    
    public void setDateLivraisonPrevue(Date dateLivraisonPrevue) {
        this.dateLivraisonPrevue = dateLivraisonPrevue;
    }
}