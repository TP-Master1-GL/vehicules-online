package com.vehicules.patterns.adapter;

import org.springframework.stereotype.Component;

@Component
public class HTMLAdapter implements DocumentGenerator {
    private HtmlGenerator htmlLibrary;

    public HTMLAdapter() {
        this.htmlLibrary = new HtmlGenerator();
    }

    @Override
    public byte[] generatePdf(String title, String content) {
        // HTML Adapter ne génère pas de PDF, retourne contenu HTML en bytes
        String htmlContent = htmlLibrary.createHtml(content);
        return htmlContent.getBytes();
    }

    @Override
    public String generateHtml(String title, String content) {
        return htmlLibrary.createHtml(content);
    }

    @Override
    public void saveToFile(byte[] pdfContent, String filePath) {
        // Pour HTML, sauvegarder le contenu
        String htmlContent = new String(pdfContent);
        htmlLibrary.saveToFile(htmlContent, filePath);
    }
}