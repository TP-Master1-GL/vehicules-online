package com.vehicules.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private Long id;
    private LocalDateTime dateCreation;
    private String statut;
    private BigDecimal montantTotal;
    private String typePaiement;
    private ClientDTO client;
    private List<LigneCommandeDTO> lignes;
}
