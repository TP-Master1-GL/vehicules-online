// src/main/java/com/vehicules/pdf/services/DocumentService.java
package com.vehicules.pdf.services;

import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.Document;
import com.vehicules.core.enums.TypeDocument;
import com.vehicules.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentService {
    
    @Autowired
    private PdfGenerationService pdfGenerationService;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private LiasseViergeService liasseViergeService;
    
    public List<byte[]> generateAllDocuments(Commande commande) throws IOException {
        List<byte[]> documents = new ArrayList<>();

        documents.add(pdfGenerationService.generateDocument(commande, TypeDocument.IMMATRICULATION));
        documents.add(pdfGenerationService.generateDocument(commande, TypeDocument.CESSION));
        documents.add(pdfGenerationService.generateDocument(commande, TypeDocument.BON_COMMANDE));

        return documents;
    }
    
    public List<Document> saveDocuments(Commande commande) throws IOException {
        List<Document> savedDocuments = new ArrayList<>();
        
        for (TypeDocument type : TypeDocument.values()) {
            byte[] content = pdfGenerationService.generateDocument(commande, type);

            Document doc = new Document();
            doc.setType(type.name());
            doc.setContenu(content);
            doc.setFormat("PDF");
            doc.setCommande(commande);

            savedDocuments.add(documentRepository.save(doc));
        }
        
        return savedDocuments;
    }
    
    public byte[] generateDocumentByType(Commande commande, String documentType) throws IOException {
        // Vérifier si on veut un document vierge
        if (documentType.toUpperCase().endsWith("_VIERGE")) {
            String baseType = documentType.replace("_VIERGE", "");
            return liasseViergeService.generateDocumentVierge(baseType);
        }
        
        TypeDocument type = TypeDocument.valueOf(documentType.toUpperCase());
        return pdfGenerationService.generateDocument(commande, type);
    }
    
    // Nouvelle méthode pour générer une liasse mixte (vierge + remplie)
    public List<byte[]> generateLiasseMixte(Commande commande) throws IOException {
        List<byte[]> documents = new ArrayList<>();
        
        // Ajouter les documents vierges
        documents.add(liasseViergeService.generateDocumentVierge("DEMANDE_IMMATRICULATION"));
        documents.add(liasseViergeService.generateDocumentVierge("CERTIFICAT_CESSION"));
        documents.add(liasseViergeService.generateDocumentVierge("BON_COMMANDE"));
        
        // Ajouter les documents remplis
        documents.add(pdfGenerationService.generateDocument(commande, TypeDocument.IMMATRICULATION));
        documents.add(pdfGenerationService.generateDocument(commande, TypeDocument.CESSION));
        documents.add(pdfGenerationService.generateDocument(commande, TypeDocument.BON_COMMANDE));
        
        return documents;
    }
}