package com.vehicules.entities;

import java.util.Date;


public class CommandeComptant extends Commande {
    
    private String typePaiement;
    private Boolean estPaye;
    private Double remise;
    private Double montantFinal;
    private Double tauxTaxe;
    
    // Constructeurs
    public CommandeComptant() {
        super();
        this.typePaiement = "COMPTANT";
        this.estPaye = false;
        this.remise = 0.0;
        this.tauxTaxe = 0.20; // 20% par défaut
    }
    
    public CommandeComptant(String numero, Double montant, Vehicule vehicule) {
        super();
        setNumero(numero);
        setMontant(montant);
        setVehicule(vehicule);
        this.typePaiement = "COMPTANT";
        this.estPaye = false;
        this.remise = 0.0;
        this.tauxTaxe = 0.20;
    }
    
    // Getters et Setters
    public String getTypePaiement() {
        return typePaiement;
    }
    
    public void setTypePaiement(String typePaiement) {
        this.typePaiement = typePaiement;
    }
    
    public Boolean getEstPaye() {
        return estPaye;
    }
    
    public void setEstPaye(Boolean estPaye) {
        this.estPaye = estPaye;
    }
    
    public Double getRemise() {
        return remise;
    }
    
    public void setRemise(Double remise) {
        this.remise = remise;
        calculerMontantFinal();
    }
    
    public Double getMontantFinal() {
        return montantFinal;
    }
    
    public Double getTauxTaxe() {
        return tauxTaxe;
    }
    
    public void setTauxTaxe(Double tauxTaxe) {
        this.tauxTaxe = tauxTaxe;
    }
    
    // Méthodes métier
    public void calculerMontantFinal() {
        Double montantBase = getMontant() != null ? getMontant() : 0.0;
        Double remisePourcentage = remise != null ? remise : 0.0;
        this.montantFinal = montantBase * (1 - remisePourcentage / 100);
    }
    
    @Override
    public void calculerTaxe() {
        if (montantFinal == null) {
            calculerMontantFinal();
        }
        setTaxe(montantFinal * tauxTaxe);
    }
    
    // Méthode pour payer la commande
    public void payer() {
        this.estPaye = true;
        setEtat(EtatCommande.VALIDEE);
        setDateValidation(new Date());
    }
    
    @Override
    public String toString() {
        return "CommandeComptant{" +
               "id=" + getId() +
               ", numero='" + getNumero() + '\'' +
               ", montant=" + getMontant() +
               ", montantFinal=" + montantFinal +
               ", remise=" + remise + "%" +
               ", estPaye=" + estPaye +
               ", etat=" + getEtat() +
               '}';
    }
}