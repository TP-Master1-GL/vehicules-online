package com.vehicules.patterns.abstractFactory;

import com.vehicules.core.entities.Vehicule;

public interface VehiculeFactory {
    Vehicule creerAutomobile();
    Vehicule creerScooter();
}