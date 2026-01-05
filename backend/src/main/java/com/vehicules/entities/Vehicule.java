package com.vehicules.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_vehicule")
public abstract class Vehicule {

    @Id
    @GeneratedValue
    private Long id;

    private String marque;
    private String modele;
    private double prixBase;

    @ManyToMany
    private List<OptionVehicule> options;
}
