package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.ScooterElectrique;
import com.vehicules.core.entities.Vehicule;

public class ScooterElectriqueFactory implements VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new ScooterElectrique();
    }
}
