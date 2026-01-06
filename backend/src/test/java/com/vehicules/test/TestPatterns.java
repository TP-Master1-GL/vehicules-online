package com.vehicules.test;

import com.vehicules.entities.*;
import com.vehicules.patterns.abstractfactory.*;
import com.vehicules.patterns.factory.CommandeFactory;
import com.vehicules.patterns.iterator.VehiculeCatalogueIterator;
import java.util.ArrayList;
import java.util.List;

public class TestPatterns {

    public static void main(String[] args) {
        System.out.println("=== TEST DES PATRONS DE CONCEPTION ===\n");
        
        // Test 1 : Abstract Factory
        testAbstractFactory();
        
        // Test 2 : Factory Method
        testFactoryMethod();
        
        // Test 3 : Iterator
        testIterator();
        
        System.out.println("\n=== TESTS TERMINÉS ===");
    }
    
    private static void testAbstractFactory() {
        System.out.println("1. TEST ABSTRACT FACTORY :");
        System.out.println("-".repeat(40));
        
        // Création des factories
        VehiculeFactory[] factories = {
            new AutomobileEssenceFactory(),
            new AutomobileElectriqueFactory(),
            new ScooterEssenceFactory(),
            new ScooterElectriqueFactory()
        };
        
        String[] noms = {
            "Automobile Essence",
            "Automobile Électrique", 
            "Scooter Essence",
            "Scooter Électrique"
        };
        
        // Test de création pour chaque factory
        for (int i = 0; i < factories.length; i++) {
            Vehicule vehicule = factories[i].creerVehicule();
            System.out.println("✓ " + noms[i] + " créé : " + vehicule.getClass().getSimpleName());
        }
        
        System.out.println();
    }
    
    private static void testFactoryMethod() {
        System.out.println("2. TEST FACTORY METHOD :");
        System.out.println("-".repeat(40));
        
        try {
            // Test création commande comptant
            Commande cmd1 = CommandeFactory.createCommande("COMPTANT");
            cmd1.setNumero("CMD-2025-001");
            cmd1.setMontant(25000.0);
            System.out.println("✓ Commande comptant créée : " + cmd1.getClass().getSimpleName());
            System.out.println("  Numéro : " + cmd1.getNumero());
            System.out.println("  Montant : " + cmd1.getMontant() + " €");
            
            // Test création commande crédit
            Commande cmd2 = CommandeFactory.createCommande("CREDIT");
            cmd2.setNumero("CMD-2025-002");
            cmd2.setMontant(35000.0);
            
            if (cmd2 instanceof CommandeCredit) {
                ((CommandeCredit) cmd2).setDureeMois(48);
                ((CommandeCredit) cmd2).setTauxInteret(3.5);
            }
            
            System.out.println("\n✓ Commande crédit créée : " + cmd2.getClass().getSimpleName());
            System.out.println("  Numéro : " + cmd2.getNumero());
            System.out.println("  Montant : " + cmd2.getMontant() + " €");
            
            // Test d'erreur
            try {
                Commande cmd3 = CommandeFactory.createCommande("INVALIDE");
            } catch (IllegalArgumentException e) {
                System.out.println("\n✓ Exception capturée : " + e.getMessage());
            }
            
        } catch (Exception e) {
            System.out.println("✗ Erreur : " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static void testIterator() {
        System.out.println("3. TEST ITERATOR (Pagination) :");
        System.out.println("-".repeat(40));
        
        // Création d'une liste de véhicules de test
        List<Vehicule> catalogue = new ArrayList<>();
        
        // Ajout de 10 véhicules fictifs
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) {
                AutomobileEssence auto = new AutomobileEssence();
                auto.setModele("Voiture " + i);
                auto.setPrix(20000 + i * 1000);
                catalogue.add(auto);
            } else {
                ScooterElectrique scooter = new ScooterElectrique();
                scooter.setModele("Scooter " + i);
                scooter.setPrix(5000 + i * 500);
                catalogue.add(scooter);
            }
        }
        
        System.out.println("Catalogue total : " + catalogue.size() + " véhicules");
        
        // Test avec 3 véhicules par page (affichage 3 par ligne)
        System.out.println("\nTest avec 3 véhicules par page :");
        testPagination(catalogue, 3);
        
        // Test avec 1 véhicule par page (affichage 1 par ligne)
        System.out.println("\nTest avec 1 véhicule par page :");
        testPagination(catalogue, 1);
    }
    
    private static void testPagination(List<Vehicule> catalogue, int pageSize) {
        VehiculeCatalogueIterator iterator = new VehiculeCatalogueIterator(catalogue, pageSize);
        int pageNum = 1;
        
        while (iterator.hasNext()) {
            List<Vehicule> page = iterator.next();
            System.out.println("\nPage " + pageNum + " (" + page.size() + " véhicules) :");
            
            for (Vehicule v : page) {
                System.out.println("  - " + v.getClass().getSimpleName() + 
                                 " : " + v.getModele() + 
                                 " (" + v.getPrix() + " €)");
            }
            pageNum++;
        }
    }
}