package com.vehicules.pdf.dto;

public class PdfResponseDTO {
    private String documentId;
    private String documentType;
    private String downloadUrl;
    private long fileSize;
    private String generatedAt;
    
    // Constructeurs
    public PdfResponseDTO() {}
    
    public PdfResponseDTO(String documentId, String documentType, String downloadUrl, long fileSize) {
        this.documentId = documentId;
        this.documentType = documentType;
        this.downloadUrl = downloadUrl;
        this.fileSize = fileSize;
        this.generatedAt = new java.util.Date().toString();
    }
    
    // Getters et Setters
    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }
    
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    
    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    
    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
}