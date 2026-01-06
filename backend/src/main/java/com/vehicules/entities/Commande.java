package com.vehicules.entities;

import javax.persistence.*;

@MappedSuperclass
public abstract class Commande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String numero;
    private double montant;
    
    // Constructeurs
    public Commande() {}
    
    public Commande(String numero, double montant) {
        this.numero = numero;
        this.montant = montant;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNumero() {
        return numero;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public double getMontant() {
        return montant;
    }
    
    public void setMontant(double montant) {
        this.montant = montant;
    }
}