package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.ScooterElectrique;
import com.vehicules.entities.Vehicule;
import com.vehicules.entities.OptionVehicule;

/**
 * Fabrique concrète pour la FAMILLE Scooter Électrique
 */
public class ScooterElectriqueFactory implements VehiculeFactory {
    
    @Override
    public Vehicule creerVehicule() {
        ScooterElectrique scooter = new ScooterElectrique();
        scooter.setModele("Scooter Électrique Urbain");
        scooter.setPrix(4500.0);
        scooter.setAutonomie(80); // 80 km
        scooter.setVitesseMax(90.0); // 90 km/h
        return scooter;
    }
    
    @Override
    public OptionVehicule creerOptionPerformance() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Boost Scooter Électrique");
        option.setDescription("Batterie supplémentaire, mode sport, recharge rapide portable");
        option.setPrix(1200.0);
        option.setCategorie("SPORT");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(false);
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionConfort() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Confort Urbain Électrique");
        option.setDescription("Chargeur portable, application connectée, siège chauffant");
        option.setPrix(1500.0);
        option.setCategorie("CONFORT");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(false);
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionSecurite() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Sécurité Électrique Urbaine");
        option.setDescription("GPS anti-vol, détection chute, feux adaptatifs, système de géolocalisation batterie");
        option.setPrix(1100.0);
        option.setCategorie("SECURITE");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(true);
        return option;
    }
}