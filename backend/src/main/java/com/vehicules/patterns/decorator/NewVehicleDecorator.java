package com.vehicules.patterns.decorator;

/**
 * Décorateur pour les véhicules neufs
 * Pattern: Decorator (Concrete Decorator)
 */
public class NewVehicleDecorator extends VehicleDisplayDecorator {

    public NewVehicleDecorator(VehicleDisplay decoratedDisplay) {
        super(decoratedDisplay);
    }

    @Override
    public String getDisplayText() {
        return super.getDisplayText() + " 🆕 NEUF";
    }

}
