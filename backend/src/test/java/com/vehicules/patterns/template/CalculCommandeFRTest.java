package com.vehicules.patterns.template;

import com.vehicules.entities.Client;
import com.vehicules.entities.LigneCommande;
import com.vehicules.entities.Vehicule;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CalculCommandeFRTest {
    
    @Test
    void testCalculerTotal_VehiculeEssence_SansRemise() {
        // Arrange - Véhicule essence < 20000€
        Client client = new Client();
        client.setNom("Jean Dupont");
        
        Vehicule vehicule = new Vehicule();
        vehicule.setId("V1");
        vehicule.setModele("Peugeot 208");
        vehicule.setPrixBase(18000.0);
        vehicule.setTypeEnergie("ESSENCE");
        
        LigneCommande ligne = new LigneCommande(vehicule, 1, null);
        List<LigneCommande> lignes = Arrays.asList(ligne);
        
        CalculCommandeFR calculateur = new CalculCommandeFR(
            18000.0, // sousTotal
            "FR", 
            client, 
            lignes
        );
        
        // Act
        double total = calculateur.calculerTotal();
        
        // Assert - 18000 + 20% TVA = 21600
        assertEquals(21600.0, total, 0.01, 
                    "Total incorrect pour véhicule essence sans remise");
    }
    
    @Test
    void testCalculerTotal_VehiculeElectrique_TVAReduite() {
        // Arrange - Véhicule électrique
        Client client = new Client();
        client.setNom("Marie Curie");
        
        Vehicule vehicule = new Vehicule();
        vehicule.setId("V2");
        vehicule.setModele("Tesla Model 3");
        vehicule.setPrixBase(45000.0);
        vehicule.setTypeEnergie("ELECTRIQUE");
        
        LigneCommande ligne = new LigneCommande(vehicule, 1, null);
        List<LigneCommande> lignes = Arrays.asList(ligne);
        
        CalculCommandeFR calculateur = new CalculCommandeFR(
            45000.0, // sousTotal
            "FR", 
            client, 
            lignes
        );
        
        // Act
        double total = calculateur.calculerTotal();
        
        // Assert - 45000 + 10% TVA = 49500, puis -5% remise (>20000) = 47025
        assertEquals(47025.0, total, 0.01, 
                    "Total incorrect pour véhicule électrique avec TVA réduite et remise");
    }
    
    @Test
    void testCalculerTotal_AvecOptions_EtRemise() {
        // Arrange - Véhicule avec options > 20000€
        Client client = new Client();
        client.setNom("Pierre Durand");
        
        Vehicule vehicule = new Vehicule();
        vehicule.setId("V3");
        vehicule.setModele("Renault Clio");
        vehicule.setPrixBase(19000.0);
        vehicule.setTypeEnergie("ESSENCE");
        
        // Prix options: sièges cuir (1500) + toit ouvrant (1200) = 2700
        List<String> options = Arrays.asList("sièges cuir", "toit ouvrant");
        LigneCommande ligne = new LigneCommande(vehicule, 1, options);
        List<LigneCommande> lignes = Arrays.asList(ligne);
        
        CalculCommandeFR calculateur = new CalculCommandeFR(
            19000.0 + 2700.0, // prix base + options
            "FR", 
            client, 
            lignes
        );
        
        // Act
        double total = calculateur.calculerTotal();
        
        // Assert - 21700 + 20% TVA = 26040, puis -5% remise (>20000) = 24738
        assertEquals(24738.0, total, 0.01, 
                    "Total incorrect pour véhicule avec options et remise");
    }
    
    @Test
    void testTemplateMethodStructure() {
        // Arrange
        Client client = new Client();
        Vehicule vehicule = new Vehicule();
        vehicule.setPrixBase(10000.0);
        
        LigneCommande ligne = new LigneCommande(vehicule, 2, null); // 2 véhicules
        List<LigneCommande> lignes = Arrays.asList(ligne);
        
        CalculCommandeFR calculateur = new CalculCommandeFR(
            20000.0, // 10000 * 2
            "FR", 
            client, 
            lignes
        );
        
        // Act
        double total = calculateur.calculerTotal();
        
        // Assert - Vérifie que la méthode template fonctionne
        assertTrue(total > 0, "Le total doit être positif");
        
        // Vérifie l'héritage
        assertTrue(calculateur instanceof CalculCommandeTemplate,
                  "CalculCommandeFR doit étendre CalculCommandeTemplate");
    }
}