package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.Vehicule;

public interface VehiculeFactory {
    Vehicule creerAutomobile();
    Vehicule creerScooter();
}