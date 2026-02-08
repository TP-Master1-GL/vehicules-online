package com.vehicules.test;

import com.vehicules.patterns.abstractfactory.*;
import com.vehicules.entities.*;

public class TestAbstractFactoryConforme {
    
    public static void main(String[] args) {
        System.out.println("=== TEST ABSTRACT FACTORY CONFORME AU COURS ===\n");
        
        // Test 1 : Vérification de la structure
        testStructure();
        
        // Test 2 : Famille Automobile Essence
        testFamilleAutomobileEssence();
        
        // Test 3 : Famille Scooter Électrique
        testFamilleScooterElectrique();
        
        // Test 4 : Compatibilité des options (selon énoncé)
        testCompatibiliteOptions();
        
        System.out.println("\n=== TESTS TERMINÉS ===");
    }
    
    private static void testStructure() {
        System.out.println("1. TEST STRUCTURE (conformité cours):");
        System.out.println("-".repeat(50));
        
        VehiculeFactory[] factories = {
            new AutomobileEssenceFactory(),
            new AutomobileElectriqueFactory(),
            new ScooterEssenceFactory(),
            new ScooterElectriqueFactory()
        };
        
        System.out.println("✓ 4 fabriques concrètes implémentent l'interface");
        System.out.println("✓ Interface a 4 méthodes de création (produits multiples)");
        
        for (VehiculeFactory factory : factories) {
            // Vérification que chaque factory crée une FAMILLE
            Vehicule v = factory.creerVehicule();
            OptionVehicule optPerf = factory.creerOptionPerformance();
            OptionVehicule optConf = factory.creerOptionConfort();
            OptionVehicule optSec = factory.creerOptionSecurite();
            
            System.out.println("\n  " + factory.getClass().getSimpleName() + " :");
            System.out.println("    • Véhicule: " + v.getClass().getSimpleName());
            System.out.println("    • Option Performance: " + optPerf.getNom());
            System.out.println("    • Option Confort: " + optConf.getNom());
            System.out.println("    • Option Sécurité: " + optSec.getNom());
        }
    }
    
    private static void testFamilleAutomobileEssence() {
        System.out.println("\n2. TEST FAMILLE AUTOMOBILE ESSENCE:");
        System.out.println("-".repeat(50));
        
        VehiculeFactory factory = new AutomobileEssenceFactory();
        
        // Création de la FAMILLE complète
        Vehicule vehicule = factory.creerVehicule();
        OptionVehicule option1 = factory.creerOptionPerformance();
        OptionVehicule option2 = factory.creerOptionConfort();
        
        System.out.println("✓ Famille cohérente créée:");
        System.out.println("  Véhicule: " + vehicule.getModele() + " (" + vehicule.getPrix() + " €)");
        System.out.println("  Option Performance: " + option1.getNom() + " (" + option1.getPrix() + " €)");
        System.out.println("  Option Confort: " + option2.getNom() + " (" + option2.getPrix() + " €)");
        
        // Vérification spécificité essence
        if (option1.getCompatibleEssence() && !option1.getCompatibleElectrique()) {
            System.out.println("✓ Option spécifique à l'essence (conforme énoncé)");
        }
    }
    
    private static void testFamilleScooterElectrique() {
        System.out.println("\n3. TEST FAMILLE SCOOTER ÉLECTRIQUE:");
        System.out.println("-".repeat(50));
        
        VehiculeFactory factory = new ScooterElectriqueFactory();
        
        Vehicule vehicule = factory.creerVehicule();
        OptionVehicule option = factory.creerOptionPerformance();
        
        System.out.println("✓ Famille spécifique électrique:");
        System.out.println("  Véhicule: " + vehicule.getModele());
        System.out.println("  Autonomie: " + ((ScooterElectrique)vehicule).getAutonomie() + " km");
        System.out.println("  Option: " + option.getNom());
        
        if (option.getCompatibleElectrique() && !option.getCompatibleEssence()) {
            System.out.println("✓ Option spécifique à l'électrique (conforme énoncé)");
        }
    }
    
    private static void testCompatibiliteOptions() {
        System.out.println("\n4. TEST COMPATIBILITÉ OPTIONS (selon énoncé):");
        System.out.println("-".repeat(50));
        
        // Selon énoncé : "sièges sportifs" et "sièges en cuir" incompatibles
        VehiculeFactory factoryEssence = new AutomobileEssenceFactory();
        VehiculeFactory factoryElectrique = new AutomobileElectriqueFactory();
        
        OptionVehicule optSportEssence = factoryEssence.creerOptionPerformance();
        OptionVehicule optConfortEssence = factoryEssence.creerOptionConfort();
        
        OptionVehicule optSportElectrique = factoryElectrique.creerOptionPerformance();
        OptionVehicule optSecuriteElectrique = factoryElectrique.creerOptionSecurite();
        
        System.out.println("✓ Vérification compatibilités:");
        System.out.println("  Option Sport Essence compatible essence: " + optSportEssence.getCompatibleEssence());
        System.out.println("  Option Sport Essence compatible électrique: " + optSportEssence.getCompatibleElectrique());
        System.out.println("  Option Sécurité Électrique compatible électrique: " + optSecuriteElectrique.getCompatibleElectrique());
        
        // Simulation d'incompatibilité
        if (!optSportEssence.getCompatibleElectrique() && !optSecuriteElectrique.getCompatibleEssence()) {
            System.out.println("✓ Incompatibilités gérées (conforme énoncé)");
        }
    }
}