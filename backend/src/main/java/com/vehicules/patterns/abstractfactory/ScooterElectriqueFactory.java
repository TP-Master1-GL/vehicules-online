package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.AutomobileElectrique;
import com.vehicules.core.entities.ScooterElectrique;
import com.vehicules.core.entities.Vehicule;

public class ScooterElectriqueFactory implements VehiculeFactory {

    @Override
    public Vehicule creerAutomobile() {
        return new AutomobileElectrique();
    }

    @Override
    public Vehicule creerScooter() {
        return new ScooterElectrique();
    }
}
