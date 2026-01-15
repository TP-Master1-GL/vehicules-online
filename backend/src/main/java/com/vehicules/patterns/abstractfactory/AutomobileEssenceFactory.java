package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.AutomobileEssence;
import com.vehicules.entities.Vehicule;
import com.vehicules.entities.OptionVehicule;

/**
 * Fabrique concrète pour la FAMILLE Automobile Essence
 * Conforme au cours : crée une FAMILLE cohérente de produits
 */
public class AutomobileEssenceFactory implements VehiculeFactory {
    
    @Override
    public Vehicule creerVehicule() {
        AutomobileEssence auto = new AutomobileEssence();
        auto.setModele("Automobile Essence Standard");
        auto.setPrix(25000.0);
        auto.setPuissance(120); // 120 CV
        auto.setConsommation(7.5); // L/100km
        return auto;
    }
    
    @Override
    public OptionVehicule creerOptionPerformance() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Kit Sport Essence");
        option.setDescription("Suspension sport, échappement performant, jantes alliage");
        option.setPrix(3000.0);
        option.setCategorie("SPORT");
        option.setCompatibleElectrique(false); // Spécifique essence
        option.setCompatibleEssence(true);
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionConfort() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Pack Confort Premium");
        option.setDescription("Sièges cuir massants, climatisation 4 zones, toit ouvrant");
        option.setPrix(5000.0);
        option.setCategorie("CONFORT");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(true);
        return option;
    }
    
    @Override
    public OptionVehicule creerOptionSecurite() {
        OptionVehicule option = new OptionVehicule();
        option.setNom("Sécurité Avancée");
        option.setDescription("Freinage d'urgence, aide au maintien de voie, détecteur angle mort");
        option.setPrix(2000.0);
        option.setCategorie("SECURITE");
        option.setCompatibleElectrique(true);
        option.setCompatibleEssence(true);
        return option;
    }
}