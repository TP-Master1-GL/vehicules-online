package com.vehicules.patterns.abstractfactory;

import com.vehicules.core.entities.AutomobileEssence;
import com.vehicules.core.entities.ScooterEssence;
import com.vehicules.core.entities.Automobile;
import com.vehicules.core.entities.Scooter;
import java.math.BigDecimal;

public class EssenceFactory implements VehiculeFactory {
    
    @Override
    public Automobile creerAutomobile(String modele, String marque, BigDecimal prixBase) {
        AutomobileEssence automobile = new AutomobileEssence();
        automobile.setModele(modele);
        automobile.setMarque(marque);
        automobile.setPrixBase(prixBase);
        return automobile;
    }
    
    @Override
    public Scooter creerScooter(String modele, String marque, BigDecimal prixBase) {
        ScooterEssence scooter = new ScooterEssence();
        scooter.setModele(modele);
        scooter.setMarque(marque);
        scooter.setPrixBase(prixBase);
        return scooter;
    }
}
