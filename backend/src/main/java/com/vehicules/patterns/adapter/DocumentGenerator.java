package com.vehicules.patterns.adapter;

public interface DocumentGenerator {
    byte[] generatePdf(String title, String content);
    String generateHtml(String title, String content);
    void saveToFile(byte[] pdfContent, String filePath);
}