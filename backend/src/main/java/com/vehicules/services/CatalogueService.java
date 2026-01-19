package com.vehicules.services;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.api.mappers.VehiculeMapper;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.iterator.*;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogueService {

    private final VehiculeRepository vehiculeRepository;
    private final VehiculeMapper vehiculeMapper;
    private final VehicleDisplayService displayService;

    public List<VehiculeDTO> getCatalogueUneLigne() {
        try {
            log.info("Récupération du catalogue une ligne");
            
            // Utiliser la méthode avec JOIN FETCH
            List<Vehicule> vehicules = vehiculeRepository.findAllWithOptions();
            
            Catalogue catalogue = new Catalogue(vehicules);
            
            List<Vehicule> vehiculesUneLigne = new ArrayList<>();
            CatalogueIterator iterator = catalogue.createUneLigneIterator();
            while (iterator.hasNext()) {
                vehiculesUneLigne.add(iterator.next());
            }
            
            log.info("{} véhicules pour l'affichage une ligne", vehiculesUneLigne.size());
            
            return vehiculesUneLigne.stream()
                    .map(vehicule -> {
                        VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
                        // Appliquer les décorateurs
                        String description = displayService.afficherAvecDecorations(vehicule);
                        dto.setDescriptionComplete(description);
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du catalogue une ligne", e);
            throw e;
        }
    }

    public List<VehiculeDTO> getCatalogueTroisLignes() {
        try {
            log.info("Récupération du catalogue trois lignes");
            
            // Utiliser la méthode avec JOIN FETCH pour précharger les options
            List<Vehicule> vehicules = vehiculeRepository.findAllWithOptions();
            
            Catalogue catalogue = new Catalogue(vehicules);
            
            List<Vehicule> vehiculesTroisLignes = new ArrayList<>();
            CatalogueIterator iterator = catalogue.createTroisLignesIterator();
            while (iterator.hasNext()) {
                vehiculesTroisLignes.add(iterator.next());
            }
            
            log.info("{} véhicules pour l'affichage trois lignes", vehiculesTroisLignes.size());
            
            // NE PAS appeler displayService.afficherAvecDecorations() ici
            // Le mapper va déjà générer la description via sa propre logique
            return vehiculesTroisLignes.stream()
                    .map(vehiculeMapper::toDTO) // ← Juste le mapper, pas le displayService
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du catalogue trois lignes", e);
            throw e;
        }
    }

    public List<VehiculeDTO> getVehiculesEnSolde() {
        try {
            log.info("Récupération des véhicules en solde");
            
            // Utiliser la méthode avec JOIN FETCH
            List<Vehicule> vehicules = vehiculeRepository.findByEnSoldeWithOptions(true);
            
            log.info("{} véhicules en solde trouvés", vehicules.size());
            
            return vehicules.stream()
                    .map(vehicule -> {
                        VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
                        // Appliquer les décorateurs
                        String description = displayService.afficherAvecDecorations(vehicule);
                        dto.setDescriptionComplete(description);
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des véhicules en solde", e);
            throw e;
        }
    }

    public VehiculeDTO getVehiculeById(Long id) {
        try {
            log.info("Récupération du véhicule par ID: {}", id);
            
            // Utiliser la méthode optimisée avec JOIN FETCH
            Vehicule vehicule = vehiculeRepository.findByIdWithAllRelations(id);
            
            if (vehicule == null) {
                throw new RuntimeException("Véhicule non trouvé avec l'id: " + id);
            }
            
            VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
            String description = displayService.afficherAvecDecorations(vehicule);
            dto.setDescriptionComplete(description);
            
            return dto;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du véhicule {}", id, e);
            throw e;
        }
    }
    
    // Version alternative pour charger un véhicule simple (sans JOIN FETCH)
    public VehiculeDTO getVehiculeByIdSimple(Long id) {
        try {
            Optional<Vehicule> vehiculeOpt = vehiculeRepository.findById(id);
            
            if (vehiculeOpt.isEmpty()) {
                throw new RuntimeException("Véhicule non trouvé avec l'id: " + id);
            }
            
            Vehicule vehicule = vehiculeOpt.get();
            
            // Initialiser manuellement les collections pour éviter LazyInitializationException
            if (vehicule.getOptions() != null) {
                vehicule.getOptions().size(); // Force l'initialisation
            }
            
            if (vehicule.getImages() != null) {
                vehicule.getImages().size(); // Force l'initialisation
            }
            
            VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
            String description = displayService.afficherAvecDecorations(vehicule);
            dto.setDescriptionComplete(description);
            
            return dto;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération simple du véhicule {}", id, e);
            throw e;
        }
    }

    @Transactional
    public void mettreEnSoldeVehiculesAnciens(int joursEnStock) {
        try {
            log.info("Mise en solde des véhicules anciens de plus de {} jours", joursEnStock);
            
            LocalDate dateLimite = LocalDate.now().minusDays(joursEnStock);
            List<Vehicule> anciensVehicules = vehiculeRepository.findByDateStockBefore(dateLimite);
            
            log.info("{} véhicules à mettre en solde", anciensVehicules.size());
            
            for (Vehicule vehicule : anciensVehicules) {
                vehicule.setEnSolde(true);
                vehicule.setPourcentageSolde(new java.math.BigDecimal("10.00"));
                vehiculeRepository.save(vehicule);
            }
            
            log.info("Mise en solde terminée");
        } catch (Exception e) {
            log.error("Erreur lors de la mise en solde des véhicules anciens", e);
            throw e;
        }
    }
    
    // Méthodes utilitaires supplémentaires
    public List<VehiculeDTO> getNouveautes() {
        try {
            LocalDate dateLimite = LocalDate.now().minusDays(30);
            List<Vehicule> vehicules = vehiculeRepository.findNouveautesWithOptions(dateLimite);
            
            return vehicules.stream()
                    .map(vehicule -> {
                        VehiculeDTO dto = vehiculeMapper.toDTO(vehicule);
                        String description = displayService.afficherAvecDecorations(vehicule);
                        dto.setDescriptionComplete(description);
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des nouveautés", e);
            throw e;
        }
    }
    
    public long countVehicules() {
        return vehiculeRepository.count();
    }
    
    public boolean isVehiculeDisponible(Long id) {
        return vehiculeRepository.findById(id)
                .map(v -> v.getQuantite() != null && v.getQuantite() > 0)
                .orElse(false);
    }
    
    // Méthode pour récupérer les statistiques du catalogue
    public Map<String, Object> getCatalogueStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalVehicles = vehiculeRepository.count();
        long vehiclesOnSale = vehiculeRepository.countByEnSolde(true);
        long newVehicles = vehiculeRepository.countByDateStockGreaterThan(LocalDate.now().minusDays(30));
        
        stats.put("totalVehicles", totalVehicles);
        stats.put("vehiclesOnSale", vehiclesOnSale);
        stats.put("newVehicles", newVehicles);
        stats.put("electricVehicles", vehiculeRepository.countByEnergie("ELECTRIQUE"));
        
        return stats;
    }
}