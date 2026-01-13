package com.vehicules.patterns.abstractFactory;

import com.vehicules.core.entities.AutomobileElectrique;
import com.vehicules.core.entities.ScooterElectrique;
import com.vehicules.core.entities.Vehicule;
import java.math.BigDecimal;

public class ElectriqueFactory implements VehiculeFactory {


    public Vehicule creerAutomobile() {
        AutomobileElectrique auto = new AutomobileElectrique();
        auto.setModele("Modèle Électrique Premium");
        auto.setMarque("Marque Électrique");
        auto.setPrixBase(BigDecimal.valueOf(40000));
        auto.setNombrePortes(5);
        auto.setNombrePlaces(5);
        auto.setCouleur("Blanc");
        auto.setPuissance(200);
        auto.setTransmission("AUTOMATIQUE");
        auto.setAutonomie(500);
        auto.setTempsChargeRapide(30);
        auto.setTypeChargeur("CCS");
        return auto;
    }

    public Vehicule creerScooter() {
        ScooterElectrique scooter = new ScooterElectrique();
        scooter.setModele("Scooter Électrique Pro");
        scooter.setMarque("Marque Éco");
        scooter.setPrixBase(BigDecimal.valueOf(5000));
        scooter.setCouleur("Noir");
        scooter.setCylindree(0); // Électrique
        scooter.setCategoriePermis("A");
        scooter.setAutonomie(150);
        scooter.setTempsCharge(120);
        scooter.setTypeBatterie("LITHIUM_ION");
        return scooter;
    }

    @Override
    public com.vehicules.entities.Vehicule creerVehicule() {
        return null;
    }
}