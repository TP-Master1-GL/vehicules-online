package com.vehicules.entities;

import jakarta.persistence.*;

@Entity

@MappedSuperclass
public abstract class Vehicule {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String modele;
    private double prix;
    
    // Constructeurs
    public Vehicule() {}
    
    public Vehicule(String modele, double prix) {
        this.modele = modele;
        this.prix = prix;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getModele() {
        return modele;
    }
    
    public void setModele(String modele) {
        this.modele = modele;
    }
    
    public double getPrix() {
        return prix;
    }
    
    public void setPrix(double prix) {
        this.prix = prix;
    }
    
    @Override
    public String toString() {
        return getClass().getSimpleName() + " [id=" + id + ", modele=" + modele + ", prix=" + prix + "]";
    }
}