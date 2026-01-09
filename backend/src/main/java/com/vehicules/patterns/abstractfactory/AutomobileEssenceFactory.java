package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.AutomobileEssence;
import com.vehicules.entities.Vehicule;

public class AutomobileEssenceFactory implements VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new AutomobileEssence();
    }
}
