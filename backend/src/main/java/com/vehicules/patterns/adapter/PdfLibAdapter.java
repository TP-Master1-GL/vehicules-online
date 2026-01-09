package com.vehicules.patterns.adapter;

// Adapter pour une bibliothèque PDF externe
public class PdfLibAdapter implements DocumentGenerator {
    private ThirdPartyPdfGenerator pdfLib;

    public PdfLibAdapter(ThirdPartyPdfGenerator pdfLib) {
        this.pdfLib = pdfLib;
    }

    @Override
    public byte[] generatePdf(String title, String content) {
        // Adaptation de l'interface - combine title et content
        String fullContent = title + "\n\n" + content;
        return pdfLib.createPdf(fullContent);
    }

    @Override
    public String generateHtml(String title, String content) {
        // Génération HTML basique pour cette implémentation
        return String.format("<html><head><title>%s</title></head><body><h1>%s</h1><p>%s</p></body></html>",
                title, title, content.replace("\n", "<br>"));
    }

    @Override
    public void saveToFile(byte[] pdfContent, String filePath) {
        pdfLib.saveToFile(pdfContent, filePath);
    }
}

// Classe simulée pour la bibliothèque externe
class ThirdPartyPdfGenerator {
    public byte[] createPdf(String content) {
        // Simulation de génération PDF
        return ("PDF: " + content).getBytes();
    }
    
    public void saveToFile(byte[] pdf, String path) {
        System.out.println("Fichier PDF sauvegardé à: " + path);
    }
}