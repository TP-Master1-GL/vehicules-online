// src/main/java/com/vehicules/pdf/dto/PdfRequestDTO.java
package com.vehicules.pdf.dto;

public class PdfRequestDTO {
    private Long commandeId;
    private String documentType;
    private boolean includeWatermark = false;
    private String language = "fr";
    
    // Getters et Setters
    public Long getCommandeId() { return commandeId; }
    public void setCommandeId(Long commandeId) { this.commandeId = commandeId; }
    
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    
    public boolean isIncludeWatermark() { return includeWatermark; }
    public void setIncludeWatermark(boolean includeWatermark) { this.includeWatermark = includeWatermark; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}