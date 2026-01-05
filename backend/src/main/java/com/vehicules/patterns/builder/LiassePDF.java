package com.vehicules.patterns.builder;

public class LiassePDF implements LiasseDocuments {
    private final byte[] pdfContent;
    
    public LiassePDF(byte[] pdfContent) {
        this.pdfContent = pdfContent;
    }
    
    @Override
    public byte[] generer() {
        return pdfContent;
    }
    
    @Override
    public String afficher() {
        return "Document PDF - Taille: " + pdfContent.length + " octets";
    }
    
    public int getTaille() {
        return pdfContent.length;
    }
}