package com.vehicules.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiculeImageDTO {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String thumbnailUrl;
    private boolean main;
    private Long fileSize;
    private String fileType;
    private LocalDateTime uploadDate;
    private Integer uploadOrder;
    
    // Méthode pour compatibilité avec Jackson
    public boolean isMain() {
        return main;
    }
    
    public void setMain(boolean main) {
        this.main = main;
    }
    
    // Constructeur pratique
    public VehiculeImageDTO(String fileName, String fileUrl, String thumbnailUrl, boolean main) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.main = main;
        this.uploadDate = LocalDateTime.now();
        this.uploadOrder = 0;
    }
    
    // Méthode utilitaire
    public String getDisplayUrl() {
        return thumbnailUrl != null && !thumbnailUrl.isEmpty() ? thumbnailUrl : fileUrl;
    }
}