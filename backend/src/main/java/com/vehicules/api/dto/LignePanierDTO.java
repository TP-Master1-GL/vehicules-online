package com.vehicules.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO représentant une ligne de panier")
public class LignePanierDTO {

    @Schema(description = "ID de la ligne", example = "1")
    private Long id;

    @Schema(description = "Informations du véhicule")
    private VehiculeDTO vehicule;

    @Schema(description = "Quantité", example = "1")
    private int quantite;

    @Schema(description = "Options sélectionnées")
    private List<OptionDTO> options;

    @Schema(description = "Prix unitaire", example = "25000.00")
    private BigDecimal prixUnitaire;

    @Schema(description = "Prix total de la ligne", example = "25000.00")
    private BigDecimal prixTotal;
}
