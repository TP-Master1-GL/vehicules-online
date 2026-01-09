package com.vehicules.api.mappers;

import com.vehicules.api.dto.OptionDTO;
import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.core.entities.OptionVehicule;
import com.vehicules.core.entities.Vehicule;
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

        return new VehiculeDTO(
                vehicule.getId(),
                vehicule.getMarque(),
                vehicule.getModele(),
                vehicule.getPrixBase(),
                vehicule.getPrixFinal(),
                vehicule.getDateStock(),
                vehicule.getEnSolde(),
                vehicule.getPourcentageSolde(),
                vehicule.getType(),
                vehicule.getEnergie(),
                optionsDTO,
                null // Sera rempli par le pattern Decorator
        );
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
