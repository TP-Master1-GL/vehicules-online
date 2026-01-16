package com.vehicules.entities;

import javax.persistence.*;

@Entity
@Table(name = "option_vehicule")
public class OptionVehicule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String description;
    private Double prix;
    
    // Types d'options (selon énoncé : "sièges sportifs", "sièges en cuir")
    private String categorie; // "CONFORT", "SPORT", "SECURITE", etc.
    private Boolean compatibleElectrique;
    private Boolean compatibleEssence;
    
    // Constructeurs
    public OptionVehicule() {
        this.compatibleElectrique = true;
        this.compatibleEssence = true;
    }
    
    public OptionVehicule(String nom, String description, Double prix, String categorie) {
        this();
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.categorie = categorie;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setNom(String nom) {
        this.nom = nom;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Double getPrix() {
        return prix;
    }
    
    public void setPrix(Double prix) {
        this.prix = prix;
    }
    
    public String getCategorie() {
        return categorie;
    }
    
    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }
    
    public Boolean getCompatibleElectrique() {
        return compatibleElectrique;
    }
    
    public void setCompatibleElectrique(Boolean compatibleElectrique) {
        this.compatibleElectrique = compatibleElectrique;
    }
    
    public Boolean getCompatibleEssence() {
        return compatibleEssence;
    }
    
    public void setCompatibleEssence(Boolean compatibleEssence) {
        this.compatibleEssence = compatibleEssence;
    }
    
    @Override
    public String toString() {
        return "OptionVehicule{" +
               "id=" + id +
               ", nom='" + nom + '\'' +
               ", prix=" + prix +
               ", categorie='" + categorie + '\'' +
               '}';
    }
}