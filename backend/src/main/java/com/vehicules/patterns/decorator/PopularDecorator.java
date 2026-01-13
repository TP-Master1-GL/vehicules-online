package com.vehicules.patterns.decorator;

/**
 * Décorateur pour les véhicules populaires
 * Pattern: Decorator (Concrete Decorator)
 */
public class PopularDecorator extends VehicleDisplayDecorator {

    public PopularDecorator(VehicleDisplay decoratedDisplay) {
        super(decoratedDisplay);
    }

    @Override
    public String getDisplayText() {
        return super.getDisplayText() + " 🔥 POPULAIRE";
    }
}
