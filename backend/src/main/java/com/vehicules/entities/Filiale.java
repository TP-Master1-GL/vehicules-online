package com.vehicules.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Filiale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String nom;

    private String adresse;

    @ManyToOne
    private Societe societeMere;

    @OneToMany
    private List<Commande> commandes;

    public Filiale(String nom, String adresse, Societe societeMere,  List<Commande> commandes) {
        this.nom = nom;
        this.adresse = adresse;
        this.societeMere = societeMere;
        this.commandes = commandes;
    }

    public Filiale() {

    }

    public double getMontantCommandes(){
        return commandes.stream()
                .mapToDouble(Commande::getMontantTotal)
                .sum();
    }


    public void afficher(){
        System.out.println("Filiale : " + nom + "Total commandes : " + getMontantCommandes());
    }
}
