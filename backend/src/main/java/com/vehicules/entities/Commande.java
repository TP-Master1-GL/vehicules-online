package com.vehicules.entities;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private Date date;

    @ManyToOne
    private Client client;

    private String typePaiement;

    private String etat;

    private Double montantTotal;

    public Commande() {
    }

    public Double getMontantTotal() {
        return montantTotal;
    }

}
