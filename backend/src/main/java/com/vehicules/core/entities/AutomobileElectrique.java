package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "automobile_electrique")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AutomobileElectrique extends Automobile {
    @Column(nullable = false)
    private Integer autonomie; // en km

    @Column(nullable = false)
    private Integer tempsChargeRapide; // en minutes pour 80%

    @Column(nullable = false)
    private String typeChargeur; // TYPE1, TYPE2, CCS, CHADEMO

    @Override
    public String getEnergie() {
        return "ELECTRIQUE";
    }
}
