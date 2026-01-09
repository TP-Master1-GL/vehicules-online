package com.vehicules.patterns.adapter;

import com.vehicules.entities.Document;
import org.springframework.stereotype.Component;

@Component
public class HTMLAdapter implements DocumentGenerator {
    private HtmlGenerator htmlLibrary;
    
    public HTMLAdapter() {
        this.htmlLibrary = new HtmlGenerator();
    }
    
    @Override
    public byte[] genererDocument(Document document) {
        // Convertir le HTML en bytes
        String htmlContent = htmlLibrary.createHtml(document.getContent());
        return htmlContent.getBytes();
    }
    
    @Override
    public void sauvegarderDocument(Document document, String chemin) {
        String htmlContent = htmlLibrary.createHtml(document.getContent());
        htmlLibrary.saveHtml(htmlContent, chemin);
    }
}