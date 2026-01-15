package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.AutomobileEssence;
import com.vehicules.core.entities.ScooterEssence;
import com.vehicules.core.entities.Vehicule;

public class ScooterEssenceFactory implements VehiculeFactory {

    @Override
    public Vehicule creerAutomobile() {
        return new AutomobileEssence();
    }

    @Override
    public Vehicule creerScooter() {
        return new ScooterEssence();
    }
}