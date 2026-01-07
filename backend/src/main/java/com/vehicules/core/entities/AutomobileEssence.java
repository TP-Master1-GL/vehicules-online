package com.vehicules.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "automobile_essence")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutomobileEssence extends Automobile {
    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal consommation; // L/100km

    @Column(nullable = false)
    private String carburant; // DIESEL, ESSENCE, GPL

    @Column(nullable = false)
    private Integer autonomie; // en km

    @Override
    public String getEnergie() {
        return "ESSENCE";
    }
}
