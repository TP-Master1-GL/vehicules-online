package com.vehicules.patterns.decorator;

/**
 * Décorateur pour les véhicules avec options
 * Pattern: Decorator (Concrete Decorator)
 */
public class OptionsDecorator extends VehicleDisplayDecorator {

    public OptionsDecorator(VehicleDisplay decoratedDisplay) {
        super(decoratedDisplay);
    }

    @Override
    public String getDisplayText() {
        String baseText = super.getDisplayText();
        return baseText + " ⚙️ AVEC OPTIONS";
    }
}
