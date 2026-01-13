package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "scooter_electrique")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScooterElectrique extends Scooter {
    @Column(nullable = false)
    private Integer autonomie; // en km

    @Column(nullable = false)
    private Integer tempsCharge; // en minutes pour charge complète

    @Column(nullable = false)
    private String typeBatterie; // LITHIUM_ION, NICKEL_METAL_HYDRIDE

    @Override
    public String getEnergie() {
        return "ELECTRIQUE";
    }
}
