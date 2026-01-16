package com.vehicules.services;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.core.entities.*;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final VehiculeRepository vehiculeRepository;
    private final CatalogueService catalogueService;
    private final VehicleDisplayService vehicleDisplayService;

    public List<VehiculeDTO> getAllVehicules() {
        return catalogueService.getCatalogueUneLigne();
    }

    public VehiculeDTO getVehiculeById(Long id) {
        return catalogueService.getVehiculeById(id);
    }

    public VehiculeDTO createVehicule(VehiculeDTO vehiculeDTO) {
        // Convertir DTO -> Entité
        Vehicule vehicule = convertDtoToEntity(vehiculeDTO);
        
        // Sauvegarder
        Vehicule saved = vehiculeRepository.save(vehicule);
        
        // Retourner DTO
        return convertEntityToDto(saved);
    }

    public VehiculeDTO updateVehicule(Long id, VehiculeDTO vehiculeDTO) {
        Optional<Vehicule> existingOpt = vehiculeRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("Véhicule non trouvé avec ID: " + id);
        }
        
        Vehicule existing = existingOpt.get();
        
        // Mettre à jour les propriétés
        updateEntityFromDto(existing, vehiculeDTO);
        
        // Sauvegarder
        Vehicule saved = vehiculeRepository.save(existing);
        
        // Retourner DTO mis à jour
        return convertEntityToDto(saved);
    }

    public void deleteVehicule(Long id) {
        if (!vehiculeRepository.existsById(id)) {
            throw new RuntimeException("Véhicule non trouvé avec ID: " + id);
        }
        vehiculeRepository.deleteById(id);
    }

    // ========== MÉTHODES DE CONVERSION ==========

    private Vehicule convertDtoToEntity(VehiculeDTO dto) {
        if (dto == null) return null;

        Vehicule vehicule;
        
        // Créer l'instance appropriée
        if ("AUTOMOBILE".equals(dto.getType())) {
            if ("ELECTRIQUE".equals(dto.getEnergie())) {
                vehicule = new AutomobileElectrique();
            } else {
                vehicule = new AutomobileEssence();
            }
        } else {
            if ("ELECTRIQUE".equals(dto.getEnergie())) {
                vehicule = new ScooterElectrique();
            } else {
                vehicule = new ScooterEssence();
            }
        }

        // Propriétés communes
        vehicule.setMarque(dto.getMarque());
        vehicule.setModele(dto.getModele());
        vehicule.setPrixBase(dto.getPrixBase());
        vehicule.setDateStock(dto.getDateStock());
        vehicule.setEnSolde(dto.getEnSolde());
        vehicule.setPourcentageSolde(dto.getPourcentageSolde());

        // Propriétés spécifiques
        if (vehicule instanceof Automobile) {
            Automobile auto = (Automobile) vehicule;
            // Les propriétés spécifiques seront mises à jour par le frontend via Map
        }

        return vehicule;
    }

    private void updateEntityFromDto(Vehicule entity, VehiculeDTO dto) {
        if (dto.getMarque() != null) entity.setMarque(dto.getMarque());
        if (dto.getModele() != null) entity.setModele(dto.getModele());
        if (dto.getPrixBase() != null) entity.setPrixBase(dto.getPrixBase());
        if (dto.getDateStock() != null) entity.setDateStock(dto.getDateStock());
        if (dto.getEnSolde() != null) entity.setEnSolde(dto.getEnSolde());
        if (dto.getPourcentageSolde() != null) entity.setPourcentageSolde(dto.getPourcentageSolde());
    }

    private VehiculeDTO convertEntityToDto(Vehicule entity) {
        if (entity == null) return null;

        VehiculeDTO dto = new VehiculeDTO();
        dto.setId(entity.getId());
        dto.setMarque(entity.getMarque());
        dto.setModele(entity.getModele());
        dto.setPrixBase(entity.getPrixBase());
        dto.setPrixFinal(entity.getPrixFinal());
        dto.setDateStock(entity.getDateStock());
        dto.setEnSolde(entity.getEnSolde());
        dto.setPourcentageSolde(entity.getPourcentageSolde());
        dto.setType(entity.getType());
        dto.setEnergie(entity.getEnergie());

        // Générer la description avec le decorator
        try {
            String displayText = vehicleDisplayService.afficherAvecDecorations(entity);
            dto.setDescriptionComplete(displayText);
        } catch (Exception e) {
            dto.setDescriptionComplete(entity.getMarque() + " " + entity.getModele());
        }

        return dto;
    }
}