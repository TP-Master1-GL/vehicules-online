// src/main/java/com/vehicules/patterns/adapter/PdfAdapter.java
package com.vehicules.patterns.adapter;

import org.springframework.stereotype.Component;

@Component
public class PdfAdapter implements DocumentGenerator {
    private iTextPdfGenerator pdfLibrary;

    public PdfAdapter() {
        this.pdfLibrary = new iTextPdfGenerator();
    }

    @Override
    public byte[] generatePdf(String title, String content) {
        return pdfLibrary.createPdf(content);
    }

    @Override
    public String generateHtml(String title, String content) {
        // PdfAdapter ne génère pas d'HTML, retourne une chaîne vide ou un message
        return "<html><body><h1>" + title + "</h1><p>PDF only</p></body></html>";
    }

    @Override
    public void saveToFile(byte[] pdfContent, String filePath) {
        pdfLibrary.saveToFile(pdfContent, filePath);
    }
}