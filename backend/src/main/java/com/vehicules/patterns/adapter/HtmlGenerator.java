package com.vehicules.patterns.adapter;

import java.io.FileWriter;
import java.io.IOException;

public class HtmlGenerator {
    
    public String createHtml(String content) {
        // Convertir le contenu en HTML simple
        return "<!DOCTYPE html>\n" +
               "<html>\n" +
               "<head>\n" +
               "    <title>Document</title>\n" +
               "    <style>\n" +
               "        body { font-family: Arial, sans-serif; margin: 40px; }\n" +
               "        .content { white-space: pre-wrap; background: #f5f5f5; padding: 20px; }\n" +
               "    </style>\n" +
               "</head>\n" +
               "<body>\n" +
               "    <div class=\"content\">" + content + "</div>\n" +
               "</body>\n" +
               "</html>";
    }
    
    public void saveToFile(String htmlContent, String filePath) {
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(htmlContent);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde du fichier HTML", e);
        }
    }
}