package com.vehicules.patterns.adapter;

import com.vehicules.core.entities.BonCommande;
import com.vehicules.core.entities.Commande;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.io.File;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PdfAdapterTest {
    
    @Test
    void testGenererDocument_AvecDocument() {
        // Arrange
        PdfAdapter adapter = new PdfAdapter();
        Commande commande = new Commande();
        commande.setId("CMD123");
        
        BonCommande document = new BonCommande(commande, new Date());
        
        // Act
        byte[] pdf = adapter.genererDocument(document);
        
        // Assert
        assertNotNull(pdf, "Le PDF généré ne doit pas être null");
        assertTrue(pdf.length > 100, "Le PDF doit avoir une taille significative");
    }
    
    @Test
    void testSauvegarderDocument_AvecDocument() {
        // Arrange
        PdfAdapter adapter = new PdfAdapter();
        Commande commande = new Commande();
        commande.setId("CMD456");
        
        BonCommande document = new BonCommande(commande, new Date());
        String filePath = "test_bon_commande.pdf";
        
        // Act & Assert
        assertDoesNotThrow(() -> {
            adapter.sauvegarderDocument(document, filePath);
        }, "La sauvegarde ne doit pas lever d'exception");
        
        // Vérifier que le fichier a été créé
        File file = new File(filePath);
        assertTrue(file.exists(), "Le fichier PDF doit être créé");
        
        // Nettoyer
        file.delete();
    }
}