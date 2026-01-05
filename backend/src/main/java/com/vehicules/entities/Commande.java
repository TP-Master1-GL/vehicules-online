package com.vehicules.entities;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_commande")
public abstract class Commande {

    @Id
    @GeneratedValue
    private Long id;

    private double montant;

    @ManyToOne
    private Client client;

    @ManyToOne
    private Vehicule vehicule;
}
