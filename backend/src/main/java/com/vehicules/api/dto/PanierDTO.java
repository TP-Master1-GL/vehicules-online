package com.vehicules.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO représentant un panier d'achat")
public class PanierDTO {

    @Schema(description = "ID du panier", example = "1")
    private Long id;

    @Schema(description = "ID du client", example = "1")
    private Long clientId;

    @Schema(description = "Lignes du panier")
    private List<LignePanierDTO> lignes;

    @Schema(description = "Montant total du panier", example = "15000.00")
    private BigDecimal montantTotal;

    @Schema(description = "Nombre total d'articles", example = "3")
    private int nombreArticles;

    @Schema(description = "Date de création du panier")
    private LocalDateTime dateCreation;

    @Schema(description = "Date de dernière modification")
    private LocalDateTime dateModification;
}
