package com.vehicules.patterns.builder;

public class LiassePDF implements LiasseDocuments {
    private StringBuilder contenu = new StringBuilder();
    
    public void ajouterPage(String titre, String contenuPage) {
        contenu.append("=== PDF Page: ").append(titre).append(" ===\n");
        contenu.append(contenuPage).append("\n\n");
    }
    
    @Override
    public String getContenu() {
        return contenu.toString();
    }
    
    @Override
    public void afficher() {
        System.out.println("=== DOCUMENT PDF ===");
        System.out.println(contenu);
        System.out.println("====================");
    }
    
    @Override
    public String getType() {
        return "PDF";
    }
}