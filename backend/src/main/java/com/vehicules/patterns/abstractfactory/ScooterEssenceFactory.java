package com.vehicules.patterns.abstractFactory;

import com.vehicules.entities.ScooterEssence;
import com.vehicules.entities.Vehicule;

public class ScooterEssenceFactory implements com.vehicules.patterns.abstractfactory.VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new ScooterEssence();
    }
}