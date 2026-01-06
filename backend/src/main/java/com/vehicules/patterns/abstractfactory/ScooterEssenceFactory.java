package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.ScooterEssence;
import com.vehicules.entities.Vehicule;

public class ScooterEssenceFactory implements VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new ScooterEssence();
    }
}