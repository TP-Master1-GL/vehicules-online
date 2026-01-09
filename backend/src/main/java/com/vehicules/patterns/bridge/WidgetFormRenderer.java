package com.vehicules.patterns.bridge;

import org.springframework.stereotype.Component;

@Component
public class WidgetFormRenderer implements FormRenderer {
    
    @Override
    public String render(String formName, String[] fields, String[] fieldTypes) {
        StringBuilder widgetJson = new StringBuilder();
        widgetJson.append("{\n");
        widgetJson.append("  \"widgetType\": \"form\",\n");
        widgetJson.append("  \"formName\": \"").append(formName).append("\",\n");
        widgetJson.append("  \"fields\": [\n");
        
        for (int i = 0; i < fields.length; i++) {
            widgetJson.append("    {\n");
            widgetJson.append("      \"fieldName\": \"").append(fields[i]).append("\",\n");
            widgetJson.append("      \"fieldType\": \"").append(fieldTypes[i]).append("\",\n");
            widgetJson.append("      \"widgetId\": \"").append(formName).append("_").append(fields[i]).append("\"\n");
            widgetJson.append("    }");
            
            if (i < fields.length - 1) {
                widgetJson.append(",");
            }
            widgetJson.append("\n");
        }
        
        widgetJson.append("  ]\n");
        widgetJson.append("}");
        
        return widgetJson.toString();
    }
    
    @Override
    public void processSubmission(String data) {
        System.out.println("Traitement Widget des données: " + data);
        // Logique de traitement pour Widget (API mobile, etc.)
    }
}