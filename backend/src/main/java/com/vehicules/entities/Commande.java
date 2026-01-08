package com.vehicules.entities;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "commande")
public class Commande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    
    @Temporal(TemporalType.DATE)
    private Date date;
    
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    
    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LigneCommande> lignes;
    
    private String etat;
    
    @Column(name = "type_paiement")
    private String typePaiement;
    
    @Column(name = "pays_livraison")
    private String paysLivraison;
    
    // Champs calculés (peuvent être persistés si besoin)
    @Transient
    private Double montantTotal;
    
    @Transient
    private Double sousTotal;
    
    public Commande() {
        this.date = new Date();
        this.etat = "EN_COURS";
    }
    
    public Commande(Client client, List<LigneCommande> lignes, String typePaiement, String paysLivraison) {
        this();
        this.client = client;
        this.typePaiement = typePaiement;
        this.paysLivraison = paysLivraison;
        this.setLignes(lignes);
    }
    
    /**
     * Calcule le sous-total de la commande (sans taxes, sans remises, sans livraison)
     */
    public double calculerSousTotal() {
        if (lignes == null || lignes.isEmpty()) {
            this.sousTotal = 0.0;
            return 0.0;
        }
        
        double total = 0.0;
        for (LigneCommande ligne : lignes) {
            total += ligne.calculerSousTotal();
        }
        this.sousTotal = total;
        return total;
    }
    
    /**
     * Valide la commande (vérifications métier)
     * Le calcul du montant total DOIT être fait par un service externe
     */
    public boolean valider() {
        if (client == null || lignes == null || lignes.isEmpty() || 
            typePaiement == null || typePaiement.trim().isEmpty() ||
            paysLivraison == null || paysLivraison.trim().isEmpty()) {
            return false;
        }
        
        // Vérifie que chaque ligne est valide
        for (LigneCommande ligne : lignes) {
            if (!ligne.estValide()) {
                return false;
            }
        }
        
        // Vérifie que le sous-total est positif
        double sousTotal = calculerSousTotal();
        if (sousTotal <= 0) {
            return false;
        }
        
        this.etat = "VALIDEE";
        return true;
    }
    
    public void changerEtat(String nouvelEtat) {
        if (nouvelEtat != null && 
            (nouvelEtat.equals("EN_COURS") || 
             nouvelEtat.equals("VALIDEE") || 
             nouvelEtat.equals("LIVREE") ||
             nouvelEtat.equals("ANNULEE"))) {
            this.etat = nouvelEtat;
        } else {
            throw new IllegalArgumentException("État invalide: " + nouvelEtat);
        }
    }
    
    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public List<LigneCommande> getLignes() { return lignes; }
    public void setLignes(List<LigneCommande> lignes) { 
        this.lignes = lignes;
        if (lignes != null) {
            for (LigneCommande ligne : lignes) {
                ligne.setCommande(this);
            }
        }
        // Réinitialise les montants calculés
        this.sousTotal = null;
        this.montantTotal = null;
    }
    
    public String getEtat() { return etat; }
    public void setEtat(String etat) { this.etat = etat; }
    
    public String getTypePaiement() { return typePaiement; }
    public void setTypePaiement(String typePaiement) { this.typePaiement = typePaiement; }
    
    public String getPaysLivraison() { return paysLivraison; }
    public void setPaysLivraison(String paysLivraison) { 
        this.paysLivraison = paysLivraison;
        // Réinitialise le montant total si le pays change
        this.montantTotal = null;
    }
    
    public Double getMontantTotal() { return montantTotal; }
    public void setMontantTotal(Double montantTotal) { this.montantTotal = montantTotal; }
    
    public Double getSousTotal() { 
        if (sousTotal == null) {
            calculerSousTotal();
        }
        return sousTotal; 
    }
    
    @Override
    public String toString() {
        return "Commande{" +
                "id='" + id + '\'' +
                ", date=" + date +
                ", client=" + (client != null ? client.getId() : "null") +
                ", nbLignes=" + (lignes != null ? lignes.size() : 0) +
                ", etat='" + etat + '\'' +
                ", paysLivraison='" + paysLivraison + '\'' +
                ", sousTotal=" + getSousTotal() +
                '}';
    }
}