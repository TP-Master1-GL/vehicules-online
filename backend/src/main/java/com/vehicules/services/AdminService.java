package com.vehicules.services;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.core.entities.*;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final VehiculeRepository vehiculeRepository;
    private final CatalogueService catalogueService;
    private final VehicleDisplayService vehicleDisplayService;

    // ========== GESTION VÉHICULES ==========
    
    public List<VehiculeDTO> getAllVehicules() {
        try {
            log.info("🚗 [ADMIN SERVICE] Récupération de tous les véhicules");
            
            List<Vehicule> vehicules = vehiculeRepository.findAll();
            
            List<VehiculeDTO> dtos = vehicules.stream()
                    .map(this::convertEntityToDto)
                    .collect(Collectors.toList());
            
            log.info("✅ [ADMIN SERVICE] {} véhicules convertis en DTO", dtos.size());
            
            return dtos;
            
        } catch (Exception e) {
            log.error("❌ [ADMIN SERVICE] Erreur récupération véhicules: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur récupération véhicules: " + e.getMessage(), e);
        }
    }

    public VehiculeDTO getVehiculeById(Long id) {
        try {
            log.info("🔍 [ADMIN SERVICE] Récupération véhicule ID: {}", id);
            
            Vehicule vehicule = vehiculeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec ID: " + id));
            
            return convertEntityToDto(vehicule);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN SERVICE] Erreur récupération véhicule {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Erreur récupération véhicule: " + e.getMessage(), e);
        }
    }

    public VehiculeDTO createVehicule(VehiculeDTO vehiculeDTO) {
        try {
            log.info("📝 [ADMIN SERVICE] Création véhicule: {}", vehiculeDTO.getMarque());
            
            // Convertir DTO -> Entité
            Vehicule vehicule = convertDtoToEntity(vehiculeDTO);
            
            // Sauvegarder
            Vehicule saved = vehiculeRepository.save(vehicule);
            
            log.info("✅ [ADMIN SERVICE] Véhicule créé avec ID: {}", saved.getId());
            
            // Retourner DTO
            return convertEntityToDto(saved);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN SERVICE] Erreur création véhicule: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur création véhicule: " + e.getMessage(), e);
        }
    }

    public VehiculeDTO updateVehicule(Long id, VehiculeDTO vehiculeDTO) {
        try {
            log.info("✏️ [ADMIN SERVICE] Mise à jour véhicule ID: {}", id);
            
            Optional<Vehicule> existingOpt = vehiculeRepository.findById(id);
            if (existingOpt.isEmpty()) {
                throw new RuntimeException("Véhicule non trouvé avec ID: " + id);
            }
            
            Vehicule existing = existingOpt.get();
            
            // Mettre à jour les propriétés
            updateEntityFromDto(existing, vehiculeDTO);
            
            // Sauvegarder
            Vehicule saved = vehiculeRepository.save(existing);
            
            log.info("✅ [ADMIN SERVICE] Véhicule {} mis à jour", id);
            
            // Retourner DTO mis à jour
            return convertEntityToDto(saved);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN SERVICE] Erreur mise à jour véhicule {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Erreur mise à jour véhicule: " + e.getMessage(), e);
        }
    }

    public void deleteVehicule(Long id) {
        try {
            log.info("🗑️ [ADMIN SERVICE] Suppression véhicule ID: {}", id);
            
            if (!vehiculeRepository.existsById(id)) {
                throw new RuntimeException("Véhicule non trouvé avec ID: " + id);
            }
            
            vehiculeRepository.deleteById(id);
            
            log.info("✅ [ADMIN SERVICE] Véhicule {} supprimé", id);
            
        } catch (Exception e) {
            log.error("❌ [ADMIN SERVICE] Erreur suppression véhicule {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Erreur suppression véhicule: " + e.getMessage(), e);
        }
    }

    // ========== MÉTHODES DE CONVERSION ==========

    private Vehicule convertDtoToEntity(VehiculeDTO dto) {
        if (dto == null) return null;

        Vehicule vehicule;
        
        // Créer l'instance appropriée
        String type = dto.getType() != null ? dto.getType().toUpperCase() : "AUTOMOBILE";
        String energie = dto.getEnergie() != null ? dto.getEnergie().toUpperCase() : "ESSENCE";
        
        log.info("🔧 [ADMIN SERVICE] Création entité - Type: {}, Energie: {}", type, energie);
        
        if ("AUTOMOBILE".equals(type)) {
            if ("ELECTRIQUE".equals(energie)) {
                vehicule = new AutomobileElectrique();
            } else {
                vehicule = new AutomobileEssence();
            }
        } else {
            if ("ELECTRIQUE".equals(energie)) {
                vehicule = new ScooterElectrique();
            } else {
                vehicule = new ScooterEssence();
            }
        }

        // Propriétés communes
        vehicule.setMarque(dto.getMarque());
        vehicule.setModele(dto.getModele());
        vehicule.setPrixBase(dto.getPrixBase() != null ? dto.getPrixBase() : BigDecimal.ZERO);
        vehicule.setDateStock(dto.getDateStock() != null ? dto.getDateStock() : LocalDate.now());
        vehicule.setEnSolde(dto.getEnSolde() != null ? dto.getEnSolde() : false);
        vehicule.setPourcentageSolde(dto.getPourcentageSolde());
        
        // Quantité par défaut
        if (vehicule.getQuantite() == null) {
            vehicule.setQuantite(1);
        }

        // Images principales
        vehicule.setImageUrl(dto.getImageUrl());
        vehicule.setImageThumbnailUrl(dto.getImageThumbnailUrl());
        
        // Note: Les images additionnelles sont gérées via VehiculeImageService
        // On ne peut pas les définir directement ici car setAdditionalImages()
        // attend une List<String> et non une List<VehiculeImageDTO>
        // Les images additionnelles seront ajoutées via l'API d'upload

        return vehicule;
    }

    private void updateEntityFromDto(Vehicule entity, VehiculeDTO dto) {
        if (dto.getMarque() != null) entity.setMarque(dto.getMarque());
        if (dto.getModele() != null) entity.setModele(dto.getModele());
        if (dto.getPrixBase() != null) entity.setPrixBase(dto.getPrixBase());
        if (dto.getDateStock() != null) entity.setDateStock(dto.getDateStock());
        if (dto.getEnSolde() != null) entity.setEnSolde(dto.getEnSolde());
        if (dto.getPourcentageSolde() != null) entity.setPourcentageSolde(dto.getPourcentageSolde());
        
        // Images principales seulement
        if (dto.getImageUrl() != null) entity.setImageUrl(dto.getImageUrl());
        if (dto.getImageThumbnailUrl() != null) entity.setImageThumbnailUrl(dto.getImageThumbnailUrl());
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
        
        // Images principales
        dto.setImageUrl(entity.getImageUrl());
        dto.setImageThumbnailUrl(entity.getImageThumbnailUrl());
        
        // Images additionnelles - converties depuis la méthode getAdditionalImages()
        dto.setAdditionalImages(entity.getAdditionalImages());

        // Propriétés calculées
        dto.setElectrique(entity.isElectrique());
        dto.setNouveau(entity.isNouveau());
        dto.setPopulaire(entity.getEnSolde() != null && entity.getEnSolde());

        // Générer la description avec le decorator
        try {
            String displayText = vehicleDisplayService.afficherAvecDecorations(entity);
            dto.setDescriptionComplete(displayText);
        } catch (Exception e) {
            log.warn("⚠️ [ADMIN SERVICE] Erreur génération description décorée: {}", e.getMessage());
            dto.setDescriptionComplete(entity.getMarque() + " " + entity.getModele());
        }

        return dto;
    }
}