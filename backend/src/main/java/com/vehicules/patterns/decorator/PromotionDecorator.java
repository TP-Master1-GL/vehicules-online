package com.vehicules.patterns.decorator;

/**
 * Décorateur pour les véhicules en promotion
 * Pattern: Decorator (Concrete Decorator)
 */
public class PromotionDecorator extends VehicleDisplayDecorator {

    private double discountPercentage;

    public PromotionDecorator(VehicleDisplay decoratedDisplay, double discountPercentage) {
        super(decoratedDisplay);
        this.discountPercentage = discountPercentage;
    }

    @Override
    public String getDisplayText() {
        String baseText = super.getDisplayText();
        double originalPrice = getVehicle().getPrixBase().doubleValue();
        double discountedPrice = originalPrice * (1 - discountPercentage / 100);

        return String.format("%s ⭐ PROMOTION -%.0f%%: %.2f€ (au lieu de %.2f€)",
                baseText, discountPercentage, discountedPrice, originalPrice);
    }
}
