package com.vehicules.services;

import com.vehicules.core.entities.Document;
import com.vehicules.patterns.adapter.DocumentGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MifService {

    private DocumentGenerator generator;

    @Autowired
    public MifService(@Qualifier("pdfAdapter") DocumentGenerator generator) {
        this.generator = generator;
    }

    public byte[] genererDocument(String title, String content) {
        return generator.generatePdf(title, content);
    }

    public void sauvegarderDocument(String title, String content, String chemin) {
        byte[] pdfContent = generator.generatePdf(title, content);
        generator.saveToFile(pdfContent, chemin);
    }

    // Méthode pour générer une liste de documents
    public List<byte[]> genererListeDocuments(List<Document> documents) {
        // Implémentation simplifiée
        return documents.stream()
            .map(doc -> generator.generatePdf(doc.getType().toString(), new String(doc.getContenu())))
            .toList();
    }
}