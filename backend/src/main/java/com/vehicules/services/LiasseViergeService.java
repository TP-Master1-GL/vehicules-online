// src/main/java/com/vehicules/pdf/services/LiasseViergeService.java
package com.vehicules.pdf.services;

import com.vehicules.patterns.singleton.LiasseVierge;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LiasseViergeService {
    
    public List<String> getDocumentsVierges() {
        return LiasseVierge.getInstance().getDocuments();
    }
    
    public byte[] generateDocumentVierge(String documentType) {
        // Obtenir l'instance singleton
        LiasseVierge liasse = LiasseVierge.getInstance();
        List<String> documents = liasse.getDocuments();
        
        // Trouver le document vierge correspondant au type
        String documentVierge = documents.stream()
            .filter(doc -> doc.contains(documentType))
            .findFirst()
            .orElse("Document vierge");
        
        // Générer le PDF à partir du template vierge
        return generatePdfFromTemplate(documentVierge);
    }
    
    public void reinitialiserLiasse() {
        LiasseVierge.getInstance().reinitialiser();
    }
    
    private byte[] generatePdfFromTemplate(String template) {
        // Utiliser le DocumentGenerator pour créer un PDF à partir du template
        // Adaptateur pour la génération PDF
        com.vehicules.patterns.adapter.DocumentGenerator generator = 
            new com.vehicules.patterns.adapter.ItextPdfAdapter();
        
        String title = "Document Vierge";
        String content = "Ceci est un document vierge prêt à être rempli.\n\n" + template;
        
        return generator.generatePdf(title, content);
    }
}