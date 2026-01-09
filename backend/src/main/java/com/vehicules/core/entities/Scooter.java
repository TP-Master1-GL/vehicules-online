package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "scooter")
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Scooter extends Vehicule {
    @Column(nullable = false)
    private String couleur;

    @Column(nullable = false)
    private Integer cylindree; // en cm³

    @Column(nullable = false)
    private String categoriePermis; // A, A1, A2

    @Override
    public String getType() {
        return "SCOOTER";
    }
}
