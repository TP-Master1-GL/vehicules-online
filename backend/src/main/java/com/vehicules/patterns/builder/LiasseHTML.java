
package com.vehicules.patterns.builder;

public class LiasseHTML implements LiasseDocuments {
    private StringBuilder contenu = new StringBuilder();
    
    public void ajouterSection(String titre, String contenuSection) {
        contenu.append("<div class='section'>\n");
        contenu.append("  <h2>").append(titre).append("</h2>\n");
        contenu.append("  <p>").append(contenuSection).append("</p>\n");
        contenu.append("</div>\n\n");
    }
    
    @Override
    public String getContenu() {
        return "<!DOCTYPE html>\n<html>\n<body>\n" + contenu.toString() + "\n</body>\n</html>";
    }
    
    @Override
    public void afficher() {
        System.out.println("=== DOCUMENT HTML ===");
        System.out.println(contenu);
        System.out.println("=====================");
    }
    
    @Override
    public String getType() {
        return "HTML";
    }
}