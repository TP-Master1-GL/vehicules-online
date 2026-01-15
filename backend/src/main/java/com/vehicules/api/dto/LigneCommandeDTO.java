package com.vehicules.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeDTO {
    private Long id;
    private Integer quantite;
    private BigDecimal prixUnitaire;
    private BigDecimal prixTotal;
    private VehiculeDTO vehicule;
    private List<OptionDTO> options;
}
