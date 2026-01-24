package com.vehicules.patterns.decorator;

import com.vehicules.core.entities.Vehicule;
import lombok.extern.slf4j.Slf4j;

/**
 * Décorateur pour les véhicules en promotion
 * Pattern: Decorator (Concrete Decorator)
 */
@Slf4j
public class PromotionDecorator extends VehicleDisplayDecorator {

    private double discountPercentage;

    // Constructeur pour VehicleDisplay (Pattern Decorator standard)
    public PromotionDecorator(VehicleDisplay decoratedDisplay, double discountPercentage) {
        super(decoratedDisplay);
        this.discountPercentage = discountPercentage;
    }

    // Constructeur supplémentaire pour compatibilité (utilisé par le contrôleur)
    public PromotionDecorator(Vehicule vehicle) {
        this(new BasicVehicleDisplay(vehicle), 
             vehicle.getPourcentageSolde() != null ? 
                vehicle.getPourcentageSolde().doubleValue() : 10.0);
    }

    @Override
    public String getDisplayText() {
        try {
            String baseText = super.getDisplayText();
            Vehicule vehicle = getVehicle();
            
            // Vérification de null pour éviter NPE
            if (vehicle == null) {
                log.warn("Véhicule null dans PromotionDecorator");
                return baseText;
            }
            
            // Vérification des prix
            if (vehicle.getPrixBase() == null) {
                log.warn("PrixBase null pour le véhicule {}", vehicle.getId());
                return baseText + " ⭐ PROMOTION -" + discountPercentage + "%";
            }
            
            double originalPrice = vehicle.getPrixBase().doubleValue();
            double discountedPrice = originalPrice * (1 - discountPercentage / 100);

            return String.format("%s ⭐ PROMOTION -%.0f%%: %.0f FCFA (au lieu de %.0f FCFA)",
                    baseText, discountPercentage, discountedPrice, originalPrice);
                    
        } catch (Exception e) {
            log.error("Erreur dans PromotionDecorator.getDisplayText()", e);
            return super.getDisplayText();
        }
    }
}