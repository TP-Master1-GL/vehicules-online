// src/main/java/com/vehicules/api/dto/CalculCommandeDTO.java
package com.vehicules.api.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CalculCommandeDTO {
    private Long commandeId;
    private String paysLivraison;
    private BigDecimal sousTotal;
    private BigDecimal montantTVA;
    private BigDecimal remise;
    private BigDecimal fraisLivraison;
    private BigDecimal total;
    private String typeCalcul;

    // Constructeurs
    public CalculCommandeDTO() {}

    public CalculCommandeDTO(Long commandeId, String paysLivraison, BigDecimal sousTotal, 
                           BigDecimal montantTVA, BigDecimal remise, BigDecimal fraisLivraison, 
                           BigDecimal total, String typeCalcul) {
        this.commandeId = commandeId;
        this.paysLivraison = paysLivraison;
        this.sousTotal = sousTotal;
        this.montantTVA = montantTVA;
        this.remise = remise;
        this.fraisLivraison = fraisLivraison;
        this.total = total;
        this.typeCalcul = typeCalcul;
    }
}