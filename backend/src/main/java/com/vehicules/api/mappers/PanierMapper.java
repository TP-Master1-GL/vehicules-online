package com.vehicules.api.mappers;

import com.vehicules.api.dto.LignePanierDTO;
import com.vehicules.api.dto.OptionDTO;
import com.vehicules.api.dto.PanierDTO;
import com.vehicules.core.entities.LignePanier;
import com.vehicules.core.entities.Panier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PanierMapper {

    private final VehiculeMapper vehiculeMapper;

    public PanierDTO toDTO(Panier panier) {
        if (panier == null) {
            return null;
        }

        List<LignePanierDTO> lignesDTO = panier.getLignes().stream()
                .map(this::toLignePanierDTO)
                .collect(Collectors.toList());

        return new PanierDTO(
                panier.getId(),
                panier.getClient() != null ? panier.getClient().getId() : null,
                lignesDTO,
                panier.getMontantTotal(),
                panier.getNombreArticles(),
                panier.getDateCreation(),
                panier.getDateModification()
        );
    }

    public LignePanierDTO toLignePanierDTO(LignePanier ligne) {
        if (ligne == null) {
            return null;
        }

        List<OptionDTO> optionsDTO = ligne.getOptions().stream()
                .map(option -> new OptionDTO(
                        option.getId(),
                        option.getNom(),
                        option.getDescription(),
                        option.getPrix(),
                        option.getObligatoire()
                ))
                .collect(Collectors.toList());

        return new LignePanierDTO(
                ligne.getId(),
                vehiculeMapper.toDTO(ligne.getVehicule()),
                ligne.getQuantite(),
                optionsDTO,
                ligne.getPrixUnitaire(),
                ligne.getPrixTotal()
        );
    }
}
