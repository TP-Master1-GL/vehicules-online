package com.vehicules.patterns.abstractFactory;

import com.vehicules.entities.AutomobileElectrique;
import com.vehicules.entities.Vehicule;

public class AutomobileElectriqueFactory implements com.vehicules.patterns.abstractFactory.VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new AutomobileElectrique();
    }
}