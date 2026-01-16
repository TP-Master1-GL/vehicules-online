package com.vehicules.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiculeDTO {
    private Long id;
    private String marque;
    private String modele;
    private BigDecimal prixBase;
    private BigDecimal prixFinal;
    private LocalDate dateStock;
    private Boolean enSolde;
    private BigDecimal pourcentageSolde;
    private String type;  // "AUTOMOBILE" ou "SCOOTER"
    private String energie; // "ESSENCE" ou "ELECTRIQUE"
    private List<OptionDTO> options;
    private String descriptionComplete; // Générée par le pattern Decorator
    
    // Champs pour les images
    private String imageUrl;
    private String imageThumbnailUrl;
    private List<String> additionalImages;
    private List<Map<String, Object>> images; // Liste complète des images avec métadonnées
    
    // ========== GETTERS POUR COMPATIBILITÉ FRONTEND ==========
    
    public BigDecimal getPrix() {
        return prixBase != null ? prixBase : BigDecimal.ZERO;
    }
    
    public String getTypeVehicule() {
        return type;
    }
    
    public String getTypeCarburant() {
        return energie;
    }
    
    public String getNomComplet() {
        return marque + " " + modele;
    }
    
    public String getPrixFormate() {
        if (prixFinal != null) {
            return String.format("%,.0f FCFA", prixFinal.doubleValue());
        }
        if (prixBase != null) {
            return String.format("%,.0f FCFA", prixBase.doubleValue());
        }
        return "0 FCFA";
    }
    
    public boolean isElectrique() {
        return "ELECTRIQUE".equalsIgnoreCase(energie);
    }
    
    // Méthode utilitaire pour obtenir l'URL de l'image principale
    public String getMainImageUrl() {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            return imageUrl;
        }
        // Image par défaut selon le type de véhicule
        if ("AUTOMOBILE".equals(type)) {
            return "/images/default-car.jpg";
        } else if ("SCOOTER".equals(type)) {
            return "/images/default-scooter.jpg";
        }
        return "/images/default-vehicle.jpg";
    }
    
    // Méthode pour obtenir l'URL de la miniature
    public String getMainThumbnailUrl() {
        if (imageThumbnailUrl != null && !imageThumbnailUrl.isEmpty()) {
            return imageThumbnailUrl;
        }
        return getMainImageUrl();
    }
    
    // Méthode pour vérifier si le véhicule a des images
    public boolean hasImages() {
        return (imageUrl != null && !imageUrl.isEmpty()) || 
               (additionalImages != null && !additionalImages.isEmpty()) ||
               (images != null && !images.isEmpty());
    }
    
    // Méthode pour obtenir toutes les URLs d'images
    public List<String> getAllImageUrls() {
        List<String> allUrls = new java.util.ArrayList<>();
        
        if (imageUrl != null && !imageUrl.isEmpty()) {
            allUrls.add(imageUrl);
        }
        
        if (additionalImages != null) {
            allUrls.addAll(additionalImages);
        }
        
        if (images != null) {
            for (Map<String, Object> image : images) {
                if (image.get("fileUrl") != null) {
                    allUrls.add(image.get("fileUrl").toString());
                }
            }
        }
        
        return allUrls;
    }
}