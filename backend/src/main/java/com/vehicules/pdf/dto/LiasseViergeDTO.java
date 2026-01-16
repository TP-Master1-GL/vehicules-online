// src/main/java/com/vehicules/pdf/dto/LiasseViergeDTO.java
package com.vehicules.pdf.dto;

import java.util.List;

public class LiasseViergeDTO {
    private List<String> documents;
    private String generatedAt;
    private String message;
    
    // Constructeurs
    public LiasseViergeDTO() {}
    
    public LiasseViergeDTO(List<String> documents) {
        this.documents = documents;
        this.generatedAt = new java.util.Date().toString();
        this.message = "Liasse vierge générée avec succès";
    }
    
    // Getters et Setters
    public List<String> getDocuments() { return documents; }
    public void setDocuments(List<String> documents) { this.documents = documents; }
    
    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}