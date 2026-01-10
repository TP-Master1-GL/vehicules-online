package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.AutomobileElectrique;
import com.vehicules.entities.Vehicule;

public class AutomobileElectriqueFactory implements VehiculeFactory {

    @Override
    public Vehicule creerVehicule() {
        return new AutomobileElectrique();
    }
}