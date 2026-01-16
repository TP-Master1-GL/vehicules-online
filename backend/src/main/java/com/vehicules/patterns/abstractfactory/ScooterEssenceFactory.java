package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.ScooterEssence;
import com.vehicules.entities.Vehicule;
import com.vehicules.entities.OptionVehicule;

/**
 * Fabrique concrète pour la FAMILLE Scooter Essence
 */
public class ScooterEssenceFactory implements VehiculeFactory {
    
    @Override
    public Vehicule creerVehicule() {
        ScooterEssence scooter = new ScooterEssence();
        scooter.setModele("Scooter Essence 125");
        scooter.setPrix(3500.0);
        scooter.setCapaciteReservoir(8.5); // 8.5L
        scooter.setTypeCarburant("SP95");
        return scooter;
    }
    
    @Override
    public OptionVehicule creerOptionPerformance() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Kit Scooter Sport");
        option.setDescription("Échappement sport, variateur performant, pneus sport");
        option.setPrix(800.0);
        option.setCategorie("SPORT");
        option.setCompatibleElectrique(false);
        option.setCompatibleEssence(true);
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionConfort() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Pack Scooter Confort");
        option.setDescription("Top case, pare-brise, siège ergonomique, antivol");
        option.setPrix(1200.0);
        option.setCategorie("CONFORT");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(true);
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionSecurite() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Sécurité Scooter");
        option.setDescription("ABS, contrôle de traction, éclairage LED, alarme");
        option.setPrix(900.0);
        option.setCategorie("SECURITE");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(true);
        return option;
    }
}