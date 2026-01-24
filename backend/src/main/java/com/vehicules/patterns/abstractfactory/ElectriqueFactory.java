package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.AutomobileElectrique;
import com.vehicules.core.entities.ScooterElectrique;
import com.vehicules.core.entities.Automobile;
import com.vehicules.core.entities.Scooter;
import java.math.BigDecimal;

public class ElectriqueFactory implements VehiculeFactory {
    
    @Override
    public Automobile creerAutomobile(String modele, String marque, BigDecimal prixBase) {
        AutomobileElectrique automobile = new AutomobileElectrique();
        automobile.setModele(modele);
        automobile.setMarque(marque);
        automobile.setPrixBase(prixBase);
        return automobile;
    }
    
    @Override
    public Scooter creerScooter(String modele, String marque, BigDecimal prixBase) {
        ScooterElectrique scooter = new ScooterElectrique();
        scooter.setModele(modele);
        scooter.setMarque(marque);
        scooter.setPrixBase(prixBase);
        return scooter;
    }
}
