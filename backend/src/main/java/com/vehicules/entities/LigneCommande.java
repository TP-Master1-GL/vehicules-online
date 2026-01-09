package com.vehicules.entities;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "ligne_commande")
public class LigneCommande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;
    
    private int quantite;
    
    @ElementCollection
    @CollectionTable(name = "ligne_commande_options", 
                     joinColumns = @JoinColumn(name = "ligne_commande_id"))
    @Column(name = "option_nom")
    private List<String> options;
    
    @ManyToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;
    
    public LigneCommande() {}
    
    public LigneCommande(Vehicule vehicule, int quantite, List<String> options) {
        this.vehicule = vehicule;
        this.quantite = quantite;
        this.options = options;
    }
    
    public double calculerSousTotal() {
        if (vehicule == null) return 0.0;
        
        double prixBase = vehicule.getPrixBase();
        double prixOptions = 0.0;
        
        if (options != null) {
            for (String option : options) {
                prixOptions += getPrixOption(option);
            }
        }
        
        return (prixBase + prixOptions) * quantite;
    }
    
    private double getPrixOption(String option) {
        return switch (option) {
            case "sièges cuir" -> 1500.0;
            case "toit ouvrant" -> 1200.0;
            case "système audio premium" -> 800.0;
            default -> 500.0;
        };
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Vehicule getVehicule() { return vehicule; }
    public void setVehicule(Vehicule vehicule) { this.vehicule = vehicule; }
    
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }
    
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    
    public Commande getCommande() { return commande; }
    public void setCommande(Commande commande) { this.commande = commande; }
}