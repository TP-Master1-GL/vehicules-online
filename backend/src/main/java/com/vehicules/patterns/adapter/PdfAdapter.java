// src/main/java/com/vehicules/patterns/adapter/PdfAdapter.java
package com.vehicules.patterns.adapter;

import com.vehicules.entities.Document;
import org.springframework.stereotype.Component;

@Component
public class PdfAdapter implements DocumentGenerator {
    private iTextPdfGenerator pdfLibrary;
    
    public PdfAdapter() {
        this.pdfLibrary = new iTextPdfGenerator();
    }
    
    @Override
    public byte[] genererDocument(Document document) {
        // Récupérer le contenu du document
        String content = document.getContent();
        if (content == null) {
            document.genererContent(); // Générer le contenu si absent
            content = document.getContent();
        }
        return pdfLibrary.createPdf(content);
    }
    
    @Override
    public void sauvegarderDocument(Document document, String chemin) {
        byte[] pdfContent = genererDocument(document);
        pdfLibrary.saveToFile(pdfContent, chemin);
    }
}