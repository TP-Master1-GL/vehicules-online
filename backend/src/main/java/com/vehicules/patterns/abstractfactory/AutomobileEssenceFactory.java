package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.AutomobileEssence;
import com.vehicules.core.entities.Vehicule;

public class AutomobileEssenceFactory implements VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new AutomobileEssence();
    }
}
