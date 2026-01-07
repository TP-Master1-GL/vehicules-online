package com.vehicules.patterns.decorator;

import com.vehicules.core.entities.Vehicule;

/**
 * Affichage de base d'un véhicule
 * Pattern: Decorator (Concrete Component)
 */
public class BasicVehicleDisplay implements VehicleDisplay {

    private Vehicule vehicule;

    public BasicVehicleDisplay(Vehicule vehicule) {
        this.vehicule = vehicule;
    }

    @Override
    public String getDisplayText() {
        return String.format("%s %s %s - %.2f€",
                vehicule.getMarque(),
                vehicule.getModele(),
                vehicule.getType(),
                vehicule.getPrixFinal());
    }

    @Override
    public Vehicule getVehicle() {
        return vehicule;
    }
}
