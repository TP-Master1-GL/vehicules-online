package com.vehicules.api.mappers;

import com.vehicules.api.dto.OptionDTO;
import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.core.entities.OptionVehicule;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.decorator.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class VehiculeMapper {

    public VehiculeDTO toDTO(Vehicule vehicule) {
        if (vehicule == null) {
            return null;
        }

        List<OptionDTO> optionsDTO = vehicule.getOptions() != null ?
                vehicule.getOptions().stream()
                        .map(this::toOptionDTO)
                        .collect(Collectors.toList()) : List.of();

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
        dto.setOptions(optionsDTO);
        
        // Appliquer le pattern Decorator pour générer la description
        String descriptionComplete = generateDecoratedDescription(vehicule, optionsDTO);
        dto.setDescriptionComplete(descriptionComplete);
        
        // Images
        dto.setImageUrl(vehicule.getImageUrl());
        dto.setImageThumbnailUrl(vehicule.getImageThumbnailUrl());
        dto.setAdditionalImages(vehicule.getAdditionalImages());

        return dto;
    }

    private String generateDecoratedDescription(Vehicule vehicule, List<OptionDTO> options) {
        // Créer l'affichage de base
        VehicleDisplay basicDisplay = new BasicVehicleDisplay(vehicule);
        VehicleDisplay decoratedDisplay = basicDisplay;
        
        // Appliquer les décorateurs dans un ordre logique
        
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
            // Convertir BigDecimal en double
            double discountPercentage = vehicule.getPourcentageSolde().doubleValue();
            decoratedDisplay = new PromotionDecorator(decoratedDisplay, discountPercentage);
        }
        
        // 4. Optionnel: Si le véhicule est populaire (vous pourriez ajouter une logique ici)
        // decoratedDisplay = new PopularDecorator(decoratedDisplay);
        
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