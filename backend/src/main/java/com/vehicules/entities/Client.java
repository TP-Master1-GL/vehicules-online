package com.vehicules.entities;

import com.vehicules.patterns.composite.ClientComponent;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.List;

@Entity

public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String nom;

    @Getter
    private String email;

    private String telephone;

    @OneToMany
    private List<Commande> commandes;

    public Client(String nom, String email, String telephone, List<Commande> commandes) {
        this.nom = nom;
        this.email = email;
        this.telephone = telephone;
        this.commandes = commandes;
    }

    public Client() {

    }

    public List<Commande> getCommandes() {
        return commandes;
    }

    public String getNom() {
        return nom;
    }


    public String getTelephone() {
        return telephone;
    }

    public double calculerTotalAchats(){
        return commandes.stream()
                .mapToDouble(Commande::getMontantTotal)
                .sum();

    }
}
