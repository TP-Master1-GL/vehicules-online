package com.vehicules.patterns.builder;

public class LiasseHTML implements LiasseDocuments {
    private final String htmlContent;
    
    public LiasseHTML(String htmlContent) {
        this.htmlContent = htmlContent;
    }
    
    @Override
    public byte[] generer() {
        return htmlContent.getBytes();
    }
    
    @Override
    public String afficher() {
        return htmlContent;
    }
    
    public String getHtmlContent() {
        return htmlContent;
    }
}