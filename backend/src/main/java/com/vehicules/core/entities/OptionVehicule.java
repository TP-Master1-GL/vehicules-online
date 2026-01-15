package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "option_vehicule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionVehicule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal prix;

    @Column(nullable = false)
    private Boolean obligatoire = false;

    @ManyToMany(mappedBy = "options", fetch = FetchType.LAZY)
    private List<Vehicule> vehicules;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "option_incompatible",
            joinColumns = @JoinColumn(name = "option1_id"),
            inverseJoinColumns = @JoinColumn(name = "option2_id")
    )
    private List<OptionVehicule> optionsIncompatibles;
}
