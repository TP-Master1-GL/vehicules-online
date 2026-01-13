package com.vehicules.patterns.abstractFactory;//

import com.vehicules.entities.ScooterElectrique;
import com.vehicules.entities.Vehicule;

public class ScooterElectriqueFactory implements com.vehicules.patterns.abstractfactory.VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new ScooterElectrique();
    }
}
