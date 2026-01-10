package com.vehicules.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class OptionVehicule {

    @Id
    @GeneratedValue
    private Long id;

    private String nom;

    @ManyToMany
    private List<OptionVehicule> optionsIncompatibles;
}
