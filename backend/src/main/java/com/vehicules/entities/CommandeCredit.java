package com.vehicules.entities;

import java.util.Date;


public class CommandeCredit extends Commande {
    
    private String typePaiement;
    private Boolean estPaye;
    private Boolean creditApprouve;
    private Boolean demandeCreditSoumise;
    private Integer dureeMois;
    private Double tauxInteret;
    private Double mensualite;
    private Date dateEcheance;
    
    // Constructeurs
    public CommandeCredit() {
        super();
        this.typePaiement = "CREDIT";
        this.estPaye = false;
        this.creditApprouve = false;
        this.demandeCreditSoumise = false;
        this.dureeMois = 48;
        this.tauxInteret = 3.5;
        calculerDateEcheance();
    }
    
    public CommandeCredit(String numero, Double montant, Vehicule vehicule, 
                         Integer dureeMois, Double tauxInteret) {
        super();
        setNumero(numero);
        setMontant(montant);
        setVehicule(vehicule);
        this.typePaiement = "CREDIT";
        this.estPaye = false;
        this.creditApprouve = false;
        this.demandeCreditSoumise = true;
        this.dureeMois = dureeMois != null ? dureeMois : 48;
        this.tauxInteret = tauxInteret != null ? tauxInteret : 3.5;
        calculerDateEcheance();
        calculerMensualite();
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
    
    public Boolean getCreditApprouve() {
        return creditApprouve;
    }
    
    public void setCreditApprouve(Boolean creditApprouve) {
        this.creditApprouve = creditApprouve;
        if (creditApprouve) {
            setEtat(EtatCommande.VALIDEE);
            setDateValidation(new Date());
        }
    }
    
    public Boolean getDemandeCreditSoumise() {
        return demandeCreditSoumise;
    }
    
    public void setDemandeCreditSoumise(Boolean demandeCreditSoumise) {
        this.demandeCreditSoumise = demandeCreditSoumise;
    }
    
    public Integer getDureeMois() {
        return dureeMois;
    }
    
    public void setDureeMois(Integer dureeMois) {
        this.dureeMois = dureeMois;
        calculerMensualite();
    }
    
    public Double getTauxInteret() {
        return tauxInteret;
    }
    
    public void setTauxInteret(Double tauxInteret) {
        this.tauxInteret = tauxInteret;
        calculerMensualite();
    }
    
    public Double getMensualite() {
        return mensualite;
    }
    
    public Date getDateEcheance() {
        return dateEcheance;
    }
    
    public void setDateEcheance(Date dateEcheance) {
        this.dateEcheance = dateEcheance;
    }
    
    // Méthodes métier
    public void calculerMensualite() {
        if (getMontant() == null || dureeMois == null || tauxInteret == null) {
            return;
        }
        
        Double montant = getMontant();
        Double tauxMensuel = tauxInteret / 12 / 100;
        Double puissance = Math.pow(1 + tauxMensuel, dureeMois);
        
        this.mensualite = (montant * tauxMensuel * puissance) / (puissance - 1);
    }
    
    private void calculerDateEcheance() {
        Date now = new Date();
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTime(now);
        cal.add(java.util.Calendar.MONTH, 1);
        this.dateEcheance = cal.getTime();
    }
    
    @Override
    public void calculerTaxe() {
        // Pour le crédit, taxe calculée sur le montant initial
        if (getMontant() != null) {
            setTaxe(getMontant() * 0.20); // 20% par défaut
        }
    }
    
    // Méthode pour soumettre la demande de crédit
    public void soumettreDemandeCredit() {
        this.demandeCreditSoumise = true;
        setEtat(EtatCommande.EN_COURS);
    }
    
    // Méthode pour approuver le crédit
    public void approuverCredit() {
        this.creditApprouve = true;
        this.demandeCreditSoumise = false;
        setEtat(EtatCommande.VALIDEE);
        setDateValidation(new Date());
    }
    
    @Override
    public String toString() {
        return "CommandeCredit{" +
               "id=" + getId() +
               ", numero='" + getNumero() + '\'' +
               ", montant=" + getMontant() +
               ", dureeMois=" + dureeMois +
               ", tauxInteret=" + tauxInteret + "%" +
               ", mensualite=" + mensualite +
               ", creditApprouve=" + creditApprouve +
               ", etat=" + getEtat() +
               '}';
    }
}