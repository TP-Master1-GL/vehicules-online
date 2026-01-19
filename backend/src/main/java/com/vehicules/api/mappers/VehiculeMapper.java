package com.vehicules.api.mappers;

import com.vehicules.api.dto.OptionDTO;
import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.api.dto.VehiculeImageDTO;
import com.vehicules.core.entities.OptionVehicule;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.core.entities.VehiculeImage;
import com.vehicules.patterns.decorator.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class VehiculeMapper {
    
    private final VehiculeImageMapper vehiculeImageMapper;

    public VehiculeMapper(VehiculeImageMapper vehiculeImageMapper) {
        this.vehiculeImageMapper = vehiculeImageMapper;
    }

    public VehiculeDTO toDTO(Vehicule vehicule) {
        if (vehicule == null) {
            return null;
        }

        // Convertir les options (vérifier si la collection est initialisée)
        List<OptionDTO> optionsDTO = null;
        try {
            if (vehicule.getOptions() != null) {
                // Vérifier si la collection est initialisée
                optionsDTO = vehicule.getOptions().stream()
                        .map(this::toOptionDTO)
                        .collect(Collectors.toList());
            } else {
                optionsDTO = List.of();
            }
        } catch (org.hibernate.LazyInitializationException e) {
            // Si la collection n'est pas initialisée, retourner une liste vide
            optionsDTO = List.of();
        }

        // Convertir les images
        List<VehiculeImageDTO> imagesDTO = null;
        try {
            if (vehicule.getImages() != null) {
                imagesDTO = vehicule.getImages().stream()
                        .map(vehiculeImageMapper::toDto)
                        .collect(Collectors.toList());
            } else {
                imagesDTO = List.of();
            }
        } catch (org.hibernate.LazyInitializationException e) {
            // Si la collection n'est pas initialisée, retourner une liste vide
            imagesDTO = List.of();
        }

        // Créer le DTO avec les valeurs de base
        VehiculeDTO dto = new VehiculeDTO();
        
        dto.setId(vehicule.getId());
        dto.setMarque(vehicule.getMarque());
        dto.setModele(vehicule.getModele());
        dto.setPrixBase(vehicule.getPrixBase());
        dto.setPrixFinal(vehicule.getPrixFinal());
        dto.setDateStock(vehicule.getDateStock());
        dto.setEnSolde(vehicule.getEnSolde());
        dto.setPourcentageSolde(vehicule.getPourcentageSolde());
        dto.setType(vehicule.getType());
        dto.setEnergie(vehicule.getEnergie());
        dto.setQuantite(vehicule.getQuantite());
        
        // Options et images
        dto.setOptions(optionsDTO != null ? optionsDTO : List.of());
        dto.setImages(imagesDTO != null ? imagesDTO : List.of());
        dto.setTotalImages(imagesDTO != null ? imagesDTO.size() : 0);
        
        // Images principales (garder la compatibilité)
        dto.setImageUrl(vehicule.getImageUrl());
        dto.setImageThumbnailUrl(vehicule.getImageThumbnailUrl());
        
        // Propriétés calculées
        dto.setElectrique("ELECTRIQUE".equalsIgnoreCase(vehicule.getEnergie()));
        dto.setNouveau(vehicule.getDateStock() != null && 
                      vehicule.getDateStock().isAfter(java.time.LocalDate.now().minusDays(30)));
        dto.setPopulaire(vehicule.getEnSolde() != null && vehicule.getEnSolde());
        
        // Appliquer le pattern Decorator pour générer la description
        String descriptionComplete = generateDecoratedDescription(vehicule, optionsDTO != null ? optionsDTO : List.of());
        dto.setDescriptionComplete(descriptionComplete);

        return dto;
    }

    private String generateDecoratedDescription(Vehicule vehicule, List<OptionDTO> options) {
        VehicleDisplay basicDisplay = new BasicVehicleDisplay(vehicule);
        VehicleDisplay decoratedDisplay = basicDisplay;
        
        // 1. Si le véhicule est récent (moins de 30 jours)
        if (vehicule.getDateStock() != null && 
            vehicule.getDateStock().isAfter(java.time.LocalDate.now().minusDays(30))) {
            decoratedDisplay = new NewVehicleDecorator(decoratedDisplay);
        }
        
        // 2. Si le véhicule a des options
        if (options != null && !options.isEmpty()) {
            decoratedDisplay = new OptionsDecorator(decoratedDisplay);
        }
        
        // 3. Si le véhicule est en solde
        if (vehicule.getEnSolde() != null && vehicule.getEnSolde() && 
            vehicule.getPourcentageSolde() != null) {
            double discountPercentage = vehicule.getPourcentageSolde().doubleValue();
            decoratedDisplay = new PromotionDecorator(decoratedDisplay, discountPercentage);
        }
        
        return decoratedDisplay.getDisplayText();
    }

    public List<VehiculeDTO> toDTOs(List<Vehicule> vehicules) {
        return vehicules.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private OptionDTO toOptionDTO(OptionVehicule option) {
        if (option == null) {
            return null;
        }

        return new OptionDTO(
                option.getId(),
                option.getNom(),
                option.getDescription(),
                option.getPrix(),
                option.getObligatoire()
        );
    }
}