package com.vehicules.pdf.services;

import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.Document;
import com.vehicules.core.enums.TypeDocument;
import com.vehicules.repositories.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {
    

    private final PdfGenerationService pdfGenerationService;

    private final DocumentRepository documentRepository;
    
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

            // Dans une vraie application, vous stockeriez le PDF dans le système de fichiers
            // et sauvegarderiez le chemin
            savedDocuments.add(documentRepository.save(doc));
        }
        
        return savedDocuments;
    }
    
    public byte[] generateDocumentByType(Commande commande, String documentType) throws IOException {
        TypeDocument type = TypeDocument.valueOf(documentType.toUpperCase());
        return pdfGenerationService.generateDocument(commande, type);
    }
}