package com.vehicules.services;

import com.vehicules.core.entities.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TaxeServiceTest {
    
    @Autowired
    private TaxeService taxeService;
    
    @Test
    void testCalculerTotalAvecTaxes_France() {
        // Arrange
        Client client = new Client();
        client.setNom("Client FR");
        
        Vehicule vehicule = new Vehicule();
        vehicule.setPrixBase(25000.0);
        vehicule.setTypeEnergie("ESSENCE");
        
        LigneCommande ligne = new LigneCommande(vehicule, 1, null);
        Commande commande = new Commande(client, Arrays.asList(ligne), "COMPTANT");
        
        // Act
        double total = taxeService.calculerTotalAvecTaxes(commande);
        
        // Assert - 25000 + 20% TVA = 30000, -5% remise (>20000) = 28500
        assertEquals(28500.0, total, 0.01);
    }
    
    @Test
    void testCalculerTotalAvecTaxes_CommandeVide() {
        // Arrange
        Commande commandeVide = new Commande();
        
        // Act
        double total = taxeService.calculerTotalAvecTaxes(commandeVide);
        
        // Assert
        assertEquals(0.0, total, 0.01, "Une commande vide doit retourner 0");
    }
}