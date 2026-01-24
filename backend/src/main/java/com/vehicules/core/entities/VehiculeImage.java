package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicule_image")
@Data
@NoArgsConstructor
public class VehiculeImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "file_url", length = 500)
    private String fileUrl;
    
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    
    // ENLEVER @Type - utiliser columnDefinition à la place
    @Column(name = "is_main", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isMain = false;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
    
    @Column(name = "upload_order")
    private Integer uploadOrder;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;
    
    // Méthode utilitaire pour compatibilité
    public boolean isMain() {
        return Boolean.TRUE.equals(isMain);
    }
    
    // Méthodes getter/setter spécifiques pour JPA
    public Boolean getMain() {
        return isMain;
    }
    
    public void setMain(Boolean main) {
        this.isMain = main;
    }
    
    // Constructeur pratique
    public VehiculeImage(String fileName, String fileUrl, String thumbnailUrl, boolean main) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.isMain = main;
        this.uploadDate = LocalDateTime.now();
        this.uploadOrder = 0;
    }
    
    // Méthode utilitaire pour obtenir l'URL d'affichage
    public String getDisplayUrl() {
        return thumbnailUrl != null && !thumbnailUrl.isEmpty() ? thumbnailUrl : fileUrl;
    }
    
    // Méthode pour extraire le nom de fichier de l'URL
    public String extractFilename() {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return null;
        }
        String[] parts = fileUrl.split("/");
        return parts[parts.length - 1];
    }
    
    // Méthode pour vérifier si l'URL est absolue
    public boolean isAbsoluteUrl() {
        return fileUrl != null && (fileUrl.startsWith("http://") || fileUrl.startsWith("https://"));
    }
    
    // Méthode pour construire une URL absolue si nécessaire
    public String ensureAbsoluteUrl(String baseUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return null;
        }
        if (isAbsoluteUrl()) {
            return fileUrl;
        }
        String filename = extractFilename();
        if (filename == null) {
            return fileUrl;
        }
        return baseUrl + "/api/images/vehicule/" + filename;
    }
}