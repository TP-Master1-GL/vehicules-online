package com.vehicules.controllers;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.patterns.decorator.*;
import com.vehicules.patterns.observer.CatalogueDisplayObserver;
import com.vehicules.patterns.observer.CatalogueObservable;
import com.vehicules.services.CatalogueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/catalogue")
@RequiredArgsConstructor
@Tag(name = "Catalogue", description = "API pour la gestion du catalogue de véhicules")
public class CatalogueController implements CatalogueObservable {

    private final CatalogueService catalogueService;
    
    // Observateurs pour le pattern Observer
    private final List<CatalogueDisplayObserver> catalogueObservers;

    /**
     * Pattern Observer: Initialisation des observateurs
     */
    @PostConstruct
    public void initObservers() {
        if (catalogueObservers != null && !catalogueObservers.isEmpty()) {
            catalogueObservers.forEach(this::addObserver);
            log.info("{} observateur(s) initialisé(s) pour le catalogue", catalogueObservers.size());
        }
    }

    @GetMapping("/une-ligne")
    @Operation(summary = "Obtenir le catalogue avec affichage une ligne par véhicule")
    public ResponseEntity<List<String>> getCatalogueUneLigne() {
        List<VehiculeDTO> vehicules = catalogueService.getCatalogueUneLigne();
        
        // Pattern Decorator: Application des décorateurs pour l'affichage
        List<String> vehiculesAvecDecorations = vehicules.stream()
                .map(dto -> {
                    // Création de l'affichage de base
                    VehicleDisplay display = new BasicVehicleDisplay(dto);
                    
                    // Application des décorateurs conditionnels
                    if (isVehiculeNouveau(dto)) {
                        display = new NewVehicleDecorator(display);
                    }
                    
                    if (isVehiculeEnPromotion(dto)) {
                        double discountPercentage = calculateDiscountPercentage(dto);
                        display = new PromotionDecorator(display, discountPercentage);
                    }
                    
                    if (isVehiculePopulaire(dto)) {
                        display = new PopularDecorator(display);
                    }
                    
                    if (hasVehiculeOptions(dto)) {
                        display = new OptionsDecorator(display);
                    }
                    
                    return display.getDisplayText();
                })
                .collect(Collectors.toList());
        
        // Pattern Observer: Notification des observateurs
        notifyObservers();
        
        return ResponseEntity.ok(vehiculesAvecDecorations);
    }

    @GetMapping("/trois-lignes")
    @Operation(summary = "Obtenir le catalogue avec affichage trois lignes par véhicule")
    public ResponseEntity<List<VehiculeDTO>> getCatalogueTroisLignes() {
        List<VehiculeDTO> vehicules = catalogueService.getCatalogueTroisLignes();
        
        // Pattern Observer: Notification des observateurs
        notifyObservers();
        
        return ResponseEntity.ok(vehicules);
    }

    @GetMapping("/soldes")
    @Operation(summary = "Obtenir les véhicules en solde")
    public ResponseEntity<List<String>> getVehiculesEnSolde() {
        List<VehiculeDTO> vehicules = catalogueService.getVehiculesEnSolde();
        
        // Pattern Decorator: Application du décorateur Promotion pour tous les véhicules en solde
        List<String> vehiculesEnSolde = vehicules.stream()
                .map(dto -> {
                    VehicleDisplay display = new BasicVehicleDisplay(dto);
                    
                    // Calcul du pourcentage de promotion
                    double discountPercentage = calculateDiscountPercentage(dto);
                    
                    // Application du décorateur Promotion
                    display = new PromotionDecorator(display, discountPercentage);
                    
                    // Ajout d'autres décorateurs si nécessaire
                    if (isVehiculeNouveau(dto)) {
                        display = new NewVehicleDecorator(display);
                    }
                    
                    // Ajouter un décorateur spécial pour les soldes
                    display = new PromotionDecorator(display, discountPercentage);
                    
                    return display.getDisplayText();
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(vehiculesEnSolde);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un véhicule par son ID")
    public ResponseEntity<String> getVehiculeById(@PathVariable Long id) {
        VehiculeDTO dto = catalogueService.getVehiculeById(id);
        
        // Pattern Decorator: Application des décorateurs pour l'affichage détaillé
        VehicleDisplay display = new BasicVehicleDisplay(dto);
        
        // Application de tous les décorateurs pertinents
        if (isVehiculeNouveau(dto)) {
            display = new NewVehicleDecorator(display);
        }
        
        if (isVehiculeEnPromotion(dto)) {
            double discountPercentage = calculateDiscountPercentage(dto);
            display = new PromotionDecorator(display, discountPercentage);
        }
        
        if (isVehiculePopulaire(dto)) {
            display = new PopularDecorator(display);
        }
        
        if (hasVehiculeOptions(dto)) {
            display = new OptionsDecorator(display);
        }
        
        // Pattern Observer: Notification des observateurs pour l'accès individuel
        notifyObservers();
        
        return ResponseEntity.ok(display.getDisplayText());
    }

    @GetMapping("/decorated/{id}")
    @Operation(summary = "Obtenir un véhicule avec tous les décorateurs applicables")
    public ResponseEntity<String> getVehiculeAvecDecorateurs(@PathVariable Long id) {
        VehiculeDTO dto = catalogueService.getVehiculeById(id);
        
        // Pattern Decorator: Chaînage de tous les décorateurs applicables
        VehicleDisplay display = new BasicVehicleDisplay(dto);
        
        // Chaînage conditionnel des décorateurs
        if (isVehiculeNouveau(dto)) {
            display = new NewVehicleDecorator(display);
        }
        
        if (isVehiculeEnPromotion(dto)) {
            double discountPercentage = calculateDiscountPercentage(dto);
            display = new PromotionDecorator(display, discountPercentage);
        }
        
        if (isVehiculePopulaire(dto)) {
            display = new PopularDecorator(display);
        }
        
        if (hasVehiculeOptions(dto)) {
            display = new OptionsDecorator(display);
        }
        
        // Décorateur spécial pour véhicules électriques
        if (dto.isElectrique()) {
            display = new VehicleDisplayDecorator(display) {
                @Override
                public String getDisplayText() {
                    return super.getDisplayText() + " ⚡ ÉLECTRIQUE";
                }
            };
        }
        
        return ResponseEntity.ok(display.getDisplayText());
    }

    @GetMapping("/nouveautes")
    @Operation(summary = "Obtenir les véhicules récemment ajoutés")
    public ResponseEntity<List<String>> getNouveautes() {
        List<VehiculeDTO> vehicules = catalogueService.getCatalogueUneLigne();
        
        // Filtrer et décorer les nouveautés
        List<String> nouveautes = vehicules.stream()
                .filter(this::isVehiculeNouveau)
                .map(dto -> {
                    VehicleDisplay display = new BasicVehicleDisplay(dto);
                    display = new NewVehicleDecorator(display);
                    
                    if (isVehiculeEnPromotion(dto)) {
                        double discountPercentage = calculateDiscountPercentage(dto);
                        display = new PromotionDecorator(display, discountPercentage);
                    }
                    
                    return display.getDisplayText();
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(nouveautes);
    }

    // Méthodes utilitaires pour déterminer les propriétés des véhicules
    private boolean isVehiculeNouveau(VehiculeDTO dto) {
        // Un véhicule est considéré comme nouveau s'il est en stock depuis moins de 30 jours
        if (dto.getDateStock() == null) {
            return false;
        }
        
        long joursEnStock = ChronoUnit.DAYS.between(dto.getDateStock(), LocalDate.now());
        return joursEnStock <= 30;
    }
    
    private boolean isVehiculeEnPromotion(VehiculeDTO dto) {
        // Vérifier si le véhicule est en solde
        if (Boolean.TRUE.equals(dto.getEnSolde())) {
            return true;
        }
        
        // Vérifier si le prix final est inférieur au prix de base
        return dto.getPrixBase() != null && dto.getPrixFinal() != null 
                && dto.getPrixFinal().compareTo(dto.getPrixBase()) < 0;
    }
    
    private double calculateDiscountPercentage(VehiculeDTO dto) {
        // Si un pourcentage de solde est spécifié, l'utiliser
        if (dto.getPourcentageSolde() != null) {
            return dto.getPourcentageSolde().doubleValue();
        }
        
        // Sinon calculer à partir des prix
        if (dto.getPrixBase() == null || dto.getPrixFinal() == null 
                || dto.getPrixBase().doubleValue() == 0) {
            return 0;
        }
        
        BigDecimal basePrice = dto.getPrixBase();
        BigDecimal finalPrice = dto.getPrixFinal();
        
        double discount = (1 - finalPrice.doubleValue() / basePrice.doubleValue()) * 100;
        return Math.round(discount * 10.0) / 10.0; // Arrondi à 1 décimale
    }
    
    private boolean isVehiculePopulaire(VehiculeDTO dto) {
        // Logique simplifiée pour déterminer la popularité
        // En production, vous pourriez utiliser le nombre de vues ou autres métriques
        // Pour l'instant, on considère comme populaire si le véhicule est électrique ET nouveau
        return dto.isElectrique() && isVehiculeNouveau(dto);
    }
    
    private boolean hasVehiculeOptions(VehiculeDTO dto) {
        // Vérifier si le véhicule a des options
        return dto.getOptions() != null && !dto.getOptions().isEmpty();
    }

    // Pattern Observer: Implémentation des méthodes de CatalogueObservable
    
    @Override
    public void addObserver(com.vehicules.patterns.observer.CatalogueObserver observer) {
        // Gestion des observateurs (simplifiée - à compléter selon vos besoins)
        log.debug("Observateur ajouté: {}", observer.getClass().getSimpleName());
    }

    @Override
    public void removeObserver(com.vehicules.patterns.observer.CatalogueObserver observer) {
        log.debug("Observateur supprimé: {}", observer.getClass().getSimpleName());
    }

    @Override
    public void notifyObservers() {
        // Notification de tous les observateurs
        if (catalogueObservers != null) {
            catalogueObservers.forEach(observer -> observer.update(this));
            log.debug("{} observateur(s) notifié(s)", catalogueObservers.size());
        }
    }

    /**
     * Implémentation de BasicVehicleDisplay adaptée pour VehiculeDTO
     */
    private static class BasicVehicleDisplay implements VehicleDisplay {
        private final VehiculeDTO vehicule;

        public BasicVehicleDisplay(VehiculeDTO vehicule) {
            this.vehicule = vehicule;
        }

        @Override
        public String getDisplayText() {
            return String.format("%s %s (%s) - %s",
                    vehicule.getMarque(),
                    vehicule.getModele(),
                    vehicule.getType(),
                    vehicule.getPrixFormate());
        }

        @Override
        public com.vehicules.core.entities.Vehicule getVehicle() {
            // Retourne null car nous utilisons un DTO
            // Dans une vraie implémentation, vous pourriez récupérer l'entité depuis le service
            return null;
        }
    }
}