package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.ScooterElectrique;
import com.vehicules.entities.Vehicule;

public class ScooterElectriqueFactory implements VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new ScooterElectrique();
    }
}
