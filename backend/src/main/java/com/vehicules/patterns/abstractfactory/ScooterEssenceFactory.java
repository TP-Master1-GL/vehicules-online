package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.ScooterEssence;
import com.vehicules.core.entities.Vehicule;

public class ScooterEssenceFactory implements VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new ScooterEssence();
    }
}