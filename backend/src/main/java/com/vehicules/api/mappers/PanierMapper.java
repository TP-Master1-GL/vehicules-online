package com.vehicules.api.mappers;

import com.vehicules.api.dto.LignePanierDTO;
import com.vehicules.api.dto.OptionDTO;
import com.vehicules.api.dto.PanierDTO;
import com.vehicules.core.entities.LignePanier;
import com.vehicules.core.entities.Panier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class PanierMapper {

    private final VehiculeMapper vehiculeMapper;

    @Transactional(readOnly = true)
    public PanierDTO toDTO(Panier panier) {
        if (panier == null) {
            return null;
        }

        // Initialiser la collection LAZY de manière sécurisée
        List<LignePanierDTO> lignesDTO = initializeAndMapLignes(panier);

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

    private List<LignePanierDTO> initializeAndMapLignes(Panier panier) {
        try {
            // Tenter d'initialiser les lignes
            Hibernate.initialize(panier.getLignes());
            
            if (panier.getLignes() == null || panier.getLignes().isEmpty()) {
                return Collections.emptyList();
            }
            
            return panier.getLignes().stream()
                    .map(this::toLignePanierDTO)
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            log.warn("Impossible de charger les lignes du panier {}: {}", panier.getId(), e.getMessage());
            return Collections.emptyList();
        }
    }

    @Transactional(readOnly = true)
    public LignePanierDTO toLignePanierDTO(LignePanier ligne) {
        if (ligne == null) {
            return null;
        }

        try {
            // Initialiser les relations de manière sécurisée
            Hibernate.initialize(ligne.getOptions());
            Hibernate.initialize(ligne.getVehicule());
            
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
            
        } catch (Exception e) {
            log.warn("Impossible de charger les relations de la ligne panier {}: {}", ligne.getId(), e.getMessage());
            
            // Retourner une version minimale de la ligne
            return new LignePanierDTO(
                    ligne.getId(),
                    null, // Véhicule non disponible
                    ligne.getQuantite(),
                    Collections.emptyList(), // Options non disponibles
                    ligne.getPrixUnitaire(),
                    ligne.getPrixTotal()
            );
        }
    }

    // Méthode utilitaire pour mapper une liste de paniers
    @Transactional(readOnly = true)
    public List<PanierDTO> toDTOList(List<Panier> paniers) {
        if (paniers == null || paniers.isEmpty()) {
            return Collections.emptyList();
        }
        
        return paniers.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}