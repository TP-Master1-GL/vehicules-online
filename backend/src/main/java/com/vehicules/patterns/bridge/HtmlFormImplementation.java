package com.vehicules.patterns.bridge;

import java.util.Map;

// Implémentation HTML
public class HtmlFormImplementation implements FormulaireImplementation {
    private StringBuilder html = new StringBuilder();
    
    public HtmlFormImplementation() {
        html.append("<form>\n");
    }
    
    @Override
    public void dessinerChampTexte(String label, String name, String valeur) {
        html.append("  <div class='form-group'>\n");
        html.append("    <label for='").append(name).append("'>").append(label).append("</label>\n");
        html.append("    <input type='text' id='").append(name).append("' name='").append(name)
             .append("' value='").append(valeur != null ? valeur : "").append("'>\n");
        html.append("  </div>\n");
    }
    
    @Override
    public void dessinerChampEmail(String label, String name, String valeur) {
        html.append("  <div class='form-group'>\n");
        html.append("    <label for='").append(name).append("'>").append(label).append("</label>\n");
        html.append("    <input type='email' id='").append(name).append("' name='").append(name)
             .append("' value='").append(valeur != null ? valeur : "").append("'>\n");
        html.append("  </div>\n");
    }
    
    @Override
    public void dessinerChampSelect(String label, String name, Map<String, String> options) {
        html.append("  <div class='form-group'>\n");
        html.append("    <label for='").append(name).append("'>").append(label).append("</label>\n");
        html.append("    <select id='").append(name).append("' name='").append(name).append("'>\n");
        
        for (Map.Entry<String, String> option : options.entrySet()) {
            html.append("      <option value='").append(option.getKey()).append("'>")
                .append(option.getValue()).append("</option>\n");
        }
        
        html.append("    </select>\n");
        html.append("  </div>\n");
    }
    
    @Override
    public void dessinerBouton(String texte, String type) {
        html.append("  <button type='").append(type).append("'>").append(texte).append("</button>\n");
    }
    
    @Override
    public String getRenduComplet() {
        return html.toString() + "</form>";
    }
    
    @Override
    public void reset() {
        html = new StringBuilder();
        html.append("<form>\n");
    }
}