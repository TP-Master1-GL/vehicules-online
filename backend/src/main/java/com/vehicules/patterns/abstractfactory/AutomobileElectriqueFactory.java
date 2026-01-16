package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.AutomobileElectrique;
import com.vehicules.entities.Vehicule;
import com.vehicules.entities.OptionVehicule;

/**
 * Fabrique concrète pour la FAMILLE Automobile Électrique
 * Crée une famille COHÉRENTE spécifique aux véhicules électriques
 */
public class AutomobileElectriqueFactory implements VehiculeFactory {
    
    @Override
    public Vehicule creerVehicule() {
        AutomobileElectrique auto = new AutomobileElectrique();
        auto.setModele("Automobile Électrique Standard");
        auto.setPrix(35000.0);
        auto.setAutonomie(400); // 400 km
        auto.setTempsRecharge(8); // 8 heures
        return auto;
    }
    
    @Override
    public OptionVehicule creerOptionPerformance() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Boost Électrique");
        option.setDescription("Mode sport électrique, accélération boostée, recharge rapide");
        option.setPrix(4000.0);
        option.setCategorie("SPORT");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(false); // Spécifique électrique
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionConfort() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Pack Silence Électrique");
        option.setDescription("Isolation phonique premium, sièges ventilés, système audio haut de gamme");
        option.setPrix(6000.0);
        option.setCategorie("CONFORT");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(true);
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionSecurite() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Sécurité Batterie");
        option.setDescription("Protection batterie, système anti-incendie électrique, monitoring température");
        option.setPrix(2500.0);
        option.setCategorie("SECURITE");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(false); // Spécifique électrique
        return option;
    }
}