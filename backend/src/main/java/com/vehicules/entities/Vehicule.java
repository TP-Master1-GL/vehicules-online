package com.vehicules.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;


import java.util.Date;


@Entity

@Getter

public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String type;

    private String modele;

    private String marque;

    private double prixBase;

    private Date dateStock;

    private boolean onSolde;

    private double prixSolde;

    public Vehicule(String type, String modele, String marque, double prixBase, Date dateStock, boolean onSolde, double prixSolde) {

        this.type = type;
        this.modele = modele;
        this.marque = marque;
        this.prixBase = prixBase;
        this.dateStock = dateStock;
        this.onSolde = onSolde;
        this.prixSolde = prixSolde;

    }

    public Vehicule() {

    }

    public void appliquerSolde(double percentage){

        this.onSolde = true;

        this.prixBase = prixSolde;

    }

    public void annulerSolde(){

        this.onSolde = false;

        this.prixSolde = prixBase;
    }

}
