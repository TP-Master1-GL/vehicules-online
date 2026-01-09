package com.vehicules.patterns.bridge;

import org.springframework.stereotype.Component;

@Component
public class HtmlFormRenderer implements FormRenderer {
    
    @Override
    public String render(String formName, String[] fields, String[] fieldTypes) {
        StringBuilder html = new StringBuilder();
        html.append("<form id=\"").append(formName).append("\">\n");
        
        for (int i = 0; i < fields.length; i++) {
            html.append("  <label for=\"").append(fields[i]).append("\">")
                .append(fields[i]).append(":</label>\n");
            html.append("  <input type=\"").append(fieldTypes[i])
                .append("\" id=\"").append(fields[i])
                .append("\" name=\"").append(fields[i]).append("\">\n<br>\n");
        }
        
        html.append("  <button type=\"submit\">Soumettre</button>\n");
        html.append("</form>");
        
        return html.toString();
    }
    
    @Override
    public void processSubmission(String data) {
        System.out.println("Traitement HTML des données: " + data);
        // Logique de traitement pour HTML
    }
}