package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "automobile")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public abstract class Automobile extends Vehicule {
    @Column(nullable = false)
    private Integer nombrePortes;

    @Column(nullable = false)
    private Integer nombrePlaces;

    @Column(nullable = false)
    private String couleur;

    @Column(nullable = false)
    private Integer puissance; // en chevaux

    @Column(nullable = false)
    private String transmission; // MANUELLE, AUTOMATIQUE

    @Override
    public String getType() {
        return "AUTOMOBILE";
    }
}
