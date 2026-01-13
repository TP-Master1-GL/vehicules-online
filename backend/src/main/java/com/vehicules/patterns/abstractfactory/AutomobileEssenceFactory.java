package com.vehicules.patterns.abstractFactory;

import com.vehicules.entities.AutomobileEssence;
import com.vehicules.entities.Vehicule;

public class AutomobileEssenceFactory implements com.vehicules.patterns.abstractFactory.VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new AutomobileEssence();
    }
}
