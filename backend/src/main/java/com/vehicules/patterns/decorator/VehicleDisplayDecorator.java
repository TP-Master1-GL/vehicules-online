package com.vehicules.patterns.decorator;

import com.vehicules.core.entities.Vehicule;

/**
 * Décorateur abstrait pour l'affichage des véhicules
 * Pattern: Decorator (Decorator)
 */
public abstract class VehicleDisplayDecorator implements VehicleDisplay {

    protected VehicleDisplay decoratedDisplay;

    public VehicleDisplayDecorator(VehicleDisplay decoratedDisplay) {
        this.decoratedDisplay = decoratedDisplay;
    }

    @Override
    public String getDisplayText() {
        return decoratedDisplay.getDisplayText();
    }

    @Override
    public Vehicule getVehicle() {
        return decoratedDisplay.getVehicle();
    }
}
