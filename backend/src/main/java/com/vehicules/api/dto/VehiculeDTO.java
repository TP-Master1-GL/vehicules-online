package com.vehicules.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiculeDTO {
    private Long id;
    private String marque;
    private String modele;
    private BigDecimal prixBase;
    private BigDecimal prixFinal;
    private LocalDate dateStock;
    private Boolean enSolde;
    private BigDecimal pourcentageSolde;
    private String type;
    private String energie;
    private List<OptionDTO> options;
    private String descriptionComplete; // Générée par le pattern Decorator
}
