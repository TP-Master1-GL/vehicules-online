package com.vehicules.entities;

import java.util.Date;


public abstract class Commande {
    private Long id;
    private String numero;
    private Double montant;
    private EtatCommande etat;
    private Date dateCreation;
    private Date dateValidation;
    private Date dateLivraison;
    private Vehicule vehicule;
    private Double taxe; // Selon pays
    private String paysLivraison;
    
    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    
    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }
    
    public EtatCommande getEtat() { return etat; }
    public void setEtat(EtatCommande etat) { this.etat = etat; }
    
    public Date getDateCreation() { return dateCreation; }
    public void setDateCreation(Date date) { this.dateCreation = date; }
    
    public Date getDateValidation() { return dateValidation; }
    public void setDateValidation(Date date) { this.dateValidation = date; }
    
    public Date getDateLivraison() { return dateLivraison; }
    public void setDateLivraison(Date date) { this.dateLivraison = date; }
    
    public Vehicule getVehicule() { return vehicule; }
    public void setVehicule(Vehicule vehicule) { this.vehicule = vehicule; }
    
    public Double getTaxe() { return taxe; }
    public void setTaxe(Double taxe) { this.taxe = taxe; }
    
    public String getPaysLivraison() { return paysLivraison; }
    public void setPaysLivraison(String pays) { this.paysLivraison = pays; }
    
    /**
     * Calcul des taxes selon pays 
     */
    public abstract void calculerTaxe();
    
    /**
     * Valider la commande 
     */
    public void valider() {
        this.etat = EtatCommande.VALIDEE;
        this.dateValidation = new Date();
    }
    
    /**
     * Livrer la commande 
     */
    public void livrer() {
        this.etat = EtatCommande.LIVREE;
        this.dateLivraison = new Date();
    }
}