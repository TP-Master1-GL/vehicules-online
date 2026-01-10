package com.vehicules.services;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.api.mappers.VehiculeMapper;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.decorator.*;
import com.vehicules.patterns.iterator.*;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogueService {

    private final VehiculeRepository vehiculeRepository;
    private final VehiculeMapper vehiculeMapper;
    private final VehicleDisplayService displayService;

    public List<VehiculeDTO> getCatalogueUneLigne() {
        List<Vehicule> vehicules = vehiculeRepository.findAll();
        Catalogue catalogue = new Catalogue(vehicules);
        
        List<Vehicule> vehiculesUneLigne = new ArrayList<>();
        CatalogueIterator iterator = catalogue.createUneLigneIterator();
        while (iterator.hasNext()) {
            vehiculesUneLigne.add(iterator.next());
        }
        
        return vehiculesUneLigne.stream()
                .map(vehicule -> {
                    VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
                    // Appliquer les décorateurs
                    String description = displayService.afficherAvecDecorations(vehicule);
                    dto.setDescriptionComplete(description);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<VehiculeDTO> getCatalogueTroisLignes() {
        List<Vehicule> vehicules = vehiculeRepository.findAll();
        Catalogue catalogue = new Catalogue(vehicules);
        
        List<Vehicule> vehiculesTroisLignes = new ArrayList<>();
        CatalogueIterator iterator = catalogue.createTroisLignesIterator();
        while (iterator.hasNext()) {
            vehiculesTroisLignes.add(iterator.next());
        }
        
        return vehiculesTroisLignes.stream()
                .map(vehicule -> {
                    VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
                    String description = displayService.afficherAvecDecorations(vehicule);
                    dto.setDescriptionComplete(description);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<VehiculeDTO> getVehiculesEnSolde() {
        List<Vehicule> vehicules = vehiculeRepository.findByEnSolde(true);
        return vehicules.stream()
                .map(vehicule -> {
                    VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
                    String description = displayService.afficherAvecDecorations(vehicule);
                    dto.setDescriptionComplete(description);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public VehiculeDTO getVehiculeById(Long id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));
        
        VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
        String description = displayService.afficherAvecDecorations(vehicule);
        dto.setDescriptionComplete(description);
        
        return dto;
    }

    public void mettreEnSoldeVehiculesAnciens(int joursEnStock) {
        LocalDate dateLimite = LocalDate.now().minusDays(joursEnStock);
        List<Vehicule> anciensVehicules = vehiculeRepository.findByDateStockBefore(dateLimite);
        
        for (Vehicule vehicule : anciensVehicules) {
            vehicule.setEnSolde(true);
            vehicule.setPourcentageSolde(new java.math.BigDecimal("10.00"));
            vehiculeRepository.save(vehicule);
        }
    }
}