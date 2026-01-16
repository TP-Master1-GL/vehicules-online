// src/test/java/com/vehicules/services/LiasseViergeServiceTest.java
package com.vehicules.services;

import com.vehicules.pdf.services.LiasseViergeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class LiasseViergeServiceTest {
    
    @Autowired
    private LiasseViergeService liasseViergeService;
    
    @Test
    void testSingletonInstance() {
        List<String> documents1 = liasseViergeService.getDocumentsVierges();
        List<String> documents2 = liasseViergeService.getDocumentsVierges();
        
        // Vérifier que c'est la même instance
        assertEquals(documents1.size(), documents2.size());
        assertEquals(3, documents1.size());
        
        // Vérifier le contenu
        assertTrue(documents1.contains("Demande d'immatriculation [VIERGE]"));
        assertTrue(documents1.contains("Certificat de cession [VIERGE]"));
        assertTrue(documents1.contains("Bon de commande [VIERGE]"));
    }
    
    @Test
    void testReinitialisation() {
        // Récupérer les documents avant réinitialisation
        List<String> before = liasseViergeService.getDocumentsVierges();
        
        // Réinitialiser
        liasseViergeService.reinitialiserLiasse();
        
        // Récupérer les documents après réinitialisation
        List<String> after = liasseViergeService.getDocumentsVierges();
        
        // Vérifier qu'ils sont identiques
        assertEquals(before.size(), after.size());
        assertEquals(before, after);
    }
}