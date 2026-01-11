package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.AutomobileElectrique; // CHANGÉ
import com.vehicules.core.entities.Vehicule; // CHANGÉ

public class AutomobileElectriqueFactory implements VehiculeFactory {
    @Override
    public Vehicule creerAutomobile() {
        return new AutomobileElectrique();
    }
    
    @Override
    public Vehicule creerScooter() {
        throw new UnsupportedOperationException("Cette factory ne crée pas de scooters");
    }
}