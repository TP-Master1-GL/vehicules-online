package com.vehicules.test;

import com.vehicules.entities.*;
import com.vehicules.patterns.abstractfactory.*;
import com.vehicules.patterns.factory.CommandeFactory;
import com.vehicules.patterns.iterator.VehiculeCatalogueIterator;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class PatternsTest {
    
    @Test
    public void testAbstractFactory() {
        // Test AutomobileEssenceFactory
        VehiculeFactory factory1 = new AutomobileEssenceFactory();
        Vehicule v1 = factory1.creerVehicule();
        assertNotNull(v1);
        assertTrue(v1 instanceof AutomobileEssence);
        
        // Test AutomobileElectriqueFactory
        VehiculeFactory factory2 = new AutomobileElectriqueFactory();
        Vehicule v2 = factory2.creerVehicule();
        assertNotNull(v2);
        assertTrue(v2 instanceof AutomobileElectrique);
        
        // Test ScooterEssenceFactory
        VehiculeFactory factory3 = new ScooterEssenceFactory();
        Vehicule v3 = factory3.creerVehicule();
        assertNotNull(v3);
        assertTrue(v3 instanceof ScooterEssence);
        
        // Test ScooterElectriqueFactory
        VehiculeFactory factory4 = new ScooterElectriqueFactory();
        Vehicule v4 = factory4.creerVehicule();
        assertNotNull(v4);
        assertTrue(v4 instanceof ScooterElectrique);
    }
    
    @Test
    public void testFactoryMethod() {
        // Test création commande comptant
        Commande cmd1 = CommandeFactory.createCommande("COMPTANT");
        assertNotNull(cmd1);
        assertTrue(cmd1 instanceof CommandeComptant);
        
        // Test création commande crédit
        Commande cmd2 = CommandeFactory.createCommande("CREDIT");
        assertNotNull(cmd2);
        assertTrue(cmd2 instanceof CommandeCredit);
        
        // Test exception pour type invalide
        assertThrows(IllegalArgumentException.class, () -> {
            CommandeFactory.createCommande("INVALIDE");
        });
    }
    
    @Test
    public void testIterator() {
        // Création d'une liste de test
        List<Vehicule> vehicules = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            AutomobileEssence auto = new AutomobileEssence();
            auto.setModele("Test " + i);
            auto.setPrix(10000 + i * 1000);
            vehicules.add(auto);
        }
        
        // Test avec pageSize = 2
        VehiculeCatalogueIterator iterator = new VehiculeCatalogueIterator(vehicules, 2);
        
        // Première page
        assertTrue(iterator.hasNext());
        List<Vehicule> page1 = iterator.next();
        assertEquals(2, page1.size());
        
        // Deuxième page
        assertTrue(iterator.hasNext());
        List<Vehicule> page2 = iterator.next();
        assertEquals(2, page2.size());
        
        // Troisième page
        assertTrue(iterator.hasNext());
        List<Vehicule> page3 = iterator.next();
        assertEquals(1, page3.size());
        
        // Plus de pages
        assertFalse(iterator.hasNext());
    }
    
    @Test
    public void testIteratorEmptyList() {
        List<Vehicule> emptyList = new ArrayList<>();
        VehiculeCatalogueIterator iterator = new VehiculeCatalogueIterator(emptyList, 3);
        
        assertFalse(iterator.hasNext());
        assertEquals(0, iterator.next().size());
    }
}