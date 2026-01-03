package com.vehicules.patterns.decorator;

import com.vehicules.core.entities.Vehicule;

/**
 * Interface pour l'affichage des véhicules
 * Pattern: Decorator (Component)
 */
public interface VehicleDisplay {

    /**
     * Retourne la description textuelle du véhicule
     */
    String getDisplayText();

    /**
     * Retourne le véhicule sous-jacent
     */
    Vehicule getVehicle();
}
