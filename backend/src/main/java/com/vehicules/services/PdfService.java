package com.vehicules.services;

import com.vehicules.entities.Document;
import com.vehicules.patterns.adapter.DocumentGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MifService {
    
    private DocumentGenerator generator;
    
    @Autowired
    public MifService(DocumentGenerator generator) {
        this.generator = generator;
    }
    
    public byte[] genererDocument(Document document) {
        return generator.genererDocument(document);
    }
    
    public void sauvegarderDocument(Document document, String chemin) {
        generator.sauvegarderDocument(document, chemin);
    }
    
    // Méthode pour générer une liste de documents
    public List<Object> genererListeDocuments(List<Document> documents) {
        // Implémentation simplifiée
        return documents.stream()
            .map(doc -> generator.genererDocument(doc))
            .toList();
    }
}