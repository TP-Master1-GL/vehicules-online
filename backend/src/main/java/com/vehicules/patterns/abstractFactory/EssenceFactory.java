package com.vehicules.patterns.abstractFactory;

import com.vehicules.core.entities.AutomobileEssence;
import com.vehicules.core.entities.ScooterEssence;
import com.vehicules.core.entities.Vehicule;
import java.math.BigDecimal;

public class EssenceFactory implements VehiculeFactory {
    @Override
    public Vehicule creerAutomobile() {
        AutomobileEssence auto = new AutomobileEssence();
        auto.setModele("Modèle Essence Standard");
        auto.setMarque("Marque Essence");
        auto.setPrixBase(BigDecimal.valueOf(20000));
        auto.setNombrePortes(5);
        auto.setNombrePlaces(5);
        auto.setCouleur("Gris");
        auto.setPuissance(130);
        auto.setTransmission("MANUELLE");
        auto.setConsommation(BigDecimal.valueOf(6.5));
        auto.setCarburant("DIESEL");
        auto.setAutonomie(800);
        return auto;
    }

    @Override
    public Vehicule creerScooter() {
        ScooterEssence scooter = new ScooterEssence();
        scooter.setModele("Scooter Essence 125");
        scooter.setMarque("Marque Scooter");
        scooter.setPrixBase(BigDecimal.valueOf(3000));
        scooter.setCouleur("Rouge");
        scooter.setCylindree(125);
        scooter.setCategoriePermis("A");
        scooter.setConsommation(BigDecimal.valueOf(4.2));
        scooter.setCarburant("ESSENCE");
        scooter.setAutonomie(300);
        return scooter;
    }
}