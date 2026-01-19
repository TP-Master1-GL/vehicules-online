package com.vehicules.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

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
    private Integer quantite;
    private String type;  // "AUTOMOBILE" ou "SCOOTER"
    private String energie; // "ESSENCE" ou "ELECTRIQUE"
    private String descriptionComplete;
    
    // Images
    private String imageUrl;
    private String imageThumbnailUrl;
    private List<VehiculeImageDTO> images = new ArrayList<>();
    private List<String> additionalImages = new ArrayList<>();
    private Integer totalImages = 0;
    
    // Propriétés calculées
    private Boolean electrique = false;
    private Boolean nouveau = false;
    private Boolean populaire = false;
    
    // Options
    private List<OptionDTO> options;
    
    // ========== GETTERS POUR COMPATIBILITÉ FRONTEND ==========
    
    public BigDecimal getPrix() {
        return prixFinal != null ? prixFinal : (prixBase != null ? prixBase : BigDecimal.ZERO);
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
        BigDecimal prix = getPrix();
        return String.format("%,.0f FCFA", prix.doubleValue());
    }
    
    public boolean isElectrique() {
        return "ELECTRIQUE".equalsIgnoreCase(energie);
    }
    
    // Méthode pour obtenir l'URL de l'image principale
    public String getMainImageUrl() {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            return imageUrl;
        }
        
        // Chercher dans la liste des images
        if (images != null && !images.isEmpty()) {
            // Chercher l'image principale
            for (VehiculeImageDTO img : images) {
                if (img.isMain() && img.getFileUrl() != null) {
                    return img.getFileUrl();
                }
            }
            // Sinon prendre la première triée par ordre
            List<VehiculeImageDTO> sortedImages = getSortedImages();
            if (!sortedImages.isEmpty()) {
                return sortedImages.get(0).getFileUrl();
            }
        }
        
        // Image par défaut selon le type de véhicule
        return getDefaultImageUrl();
    }
    
    // Méthode pour obtenir l'URL de la miniature
    public String getMainThumbnailUrl() {
        if (imageThumbnailUrl != null && !imageThumbnailUrl.isEmpty()) {
            return imageThumbnailUrl;
        }
        
        // Chercher dans la liste des images
        if (images != null && !images.isEmpty()) {
            // Chercher l'image principale
            for (VehiculeImageDTO img : images) {
                if (img.isMain() && img.getThumbnailUrl() != null) {
                    return img.getThumbnailUrl();
                }
            }
            // Sinon prendre la première
            List<VehiculeImageDTO> sortedImages = getSortedImages();
            if (!sortedImages.isEmpty()) {
                VehiculeImageDTO firstImage = sortedImages.get(0);
                return firstImage.getThumbnailUrl() != null ? firstImage.getThumbnailUrl() : firstImage.getFileUrl();
            }
        }
        
        return getMainImageUrl();
    }
    
    // Méthode pour vérifier si le véhicule a des images
    public boolean hasImages() {
        return (imageUrl != null && !imageUrl.isEmpty()) || 
               (images != null && !images.isEmpty());
    }
    
    // Méthode pour obtenir le nombre total d'images
    public Integer getTotalImages() {
        int count = 0;
        if (imageUrl != null && !imageUrl.isEmpty()) {
            count++;
        }
        if (images != null) {
            count += images.size();
        }
        return count;
    }
    
    // Méthode pour obtenir toutes les URLs d'images
    public List<String> getAllImageUrls() {
        List<String> allUrls = new ArrayList<>();
        
        // Image principale
        String mainUrl = getMainImageUrl();
        if (mainUrl != null && !mainUrl.isEmpty() && !mainUrl.contains("default-")) {
            allUrls.add(mainUrl);
        }
        
        // Images supplémentaires (sans l'image principale déjà ajoutée)
        if (images != null) {
            for (VehiculeImageDTO image : images) {
                if (image.getFileUrl() != null && !image.getFileUrl().equals(mainUrl)) {
                    allUrls.add(image.getFileUrl());
                }
            }
        }
        
        return allUrls;
    }
    
    // Méthode pour obtenir toutes les images triées (principale d'abord, puis par ordre)
    public List<VehiculeImageDTO> getSortedImages() {
        if (images == null || images.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<VehiculeImageDTO> sortedImages = new ArrayList<>(images);
        sortedImages.sort(Comparator.comparing(VehiculeImageDTO::isMain).reversed()
                .thenComparing(Comparator.comparing(VehiculeImageDTO::getUploadOrder, 
                        Comparator.nullsFirst(Comparator.naturalOrder())))
                .thenComparing(Comparator.comparing(VehiculeImageDTO::getUploadDate, 
                        Comparator.nullsFirst(Comparator.reverseOrder()))));
        
        return sortedImages;
    }
    
    // Méthode pour obtenir les images supplémentaires (sans l'image principale)
    public List<VehiculeImageDTO> getAdditionalImages() {
        if (images == null || images.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<VehiculeImageDTO> additionalImages = new ArrayList<>();
        for (VehiculeImageDTO image : images) {
            if (!image.isMain()) {
                additionalImages.add(image);
            }
        }
        
        // Trier par ordre
        additionalImages.sort(Comparator.comparing(VehiculeImageDTO::getUploadOrder, 
                Comparator.nullsFirst(Comparator.naturalOrder())));
        
        return additionalImages;
    }
    
    // Méthode pour obtenir l'image par défaut selon le type de véhicule
    private String getDefaultImageUrl() {
        if ("AUTOMOBILE".equals(type)) {
            return "/images/default-car.jpg";
        } else if ("SCOOTER".equals(type)) {
            return "/images/default-scooter.jpg";
        }
        return "/images/default-vehicle.jpg";
    }
}