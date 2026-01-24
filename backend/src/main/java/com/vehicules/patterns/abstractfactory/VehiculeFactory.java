package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.Automobile;
import com.vehicules.core.entities.Scooter;
import java.math.BigDecimal;

public interface VehiculeFactory {
    Automobile creerAutomobile(String modele, String marque, BigDecimal prixBase);
    Scooter creerScooter(String modele, String marque, BigDecimal prixBase);
}
