package com.vehicules.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicule")
@Data
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Vehicule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String marque;

    @Column(nullable = false)
    private String modele;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prixBase;

    @Column(precision = 10, scale = 2)
    private BigDecimal prixFinal;

    @Column(nullable = false)
    private LocalDate dateStock;

    @Column(nullable = false)
    private Boolean enSolde = false;

    @Column(precision = 5, scale = 2)
    private BigDecimal pourcentageSolde;

    @Column(nullable = false)
    private Integer quantite = 1;

    private String type;  // "AUTOMOBILE" ou "SCOOTER"
    private String energie; // "ESSENCE" ou "ELECTRIQUE"

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "vehicule_option",
            joinColumns = @JoinColumn(name = "vehicule_id"),
            inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private List<OptionVehicule> options;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "image_thumbnail_url", length = 500)
    private String imageThumbnailUrl;

    @JsonIgnore
    @OneToMany(mappedBy = "vehicule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VehiculeImage> images = new ArrayList<>();

    public String getTypeEnergie() {
        return energie;
    }

    public BigDecimal getPrix() {
        return getPrixFinal();
    }

    public BigDecimal getPrixFinal() {
        if (prixFinal != null) {
            return prixFinal;
        }
        
        BigDecimal prix = prixBase;
        if (enSolde && pourcentageSolde != null) {
            prix = prix.subtract(prix.multiply(pourcentageSolde.divide(BigDecimal.valueOf(100))));
        }
        return prix;
    }
    
    // MÉTHODES UTILITAIRES POUR GÉRER LES IMAGES VehiculeImage
    public void addImage(VehiculeImage image) {
        if (this.images == null) {
            this.images = new ArrayList<>();
        }
        image.setVehicule(this);
        this.images.add(image);
    }
    
    public void removeImage(VehiculeImage image) {
        if (this.images != null) {
            this.images.remove(image);
            image.setVehicule(null);
        }
    }
    
    // Méthode pour obtenir toutes les URLs d'images
    public List<String> getAllImageUrls() {
        List<String> allUrls = new ArrayList<>();
        
        // Image principale
        if (imageUrl != null) {
            allUrls.add(imageUrl);
        }
        
        // Images VehiculeImage
        if (images != null) {
            for (VehiculeImage img : images) {
                if (img.getFileUrl() != null) {
                    allUrls.add(img.getFileUrl());
                }
            }
        }
        
        return allUrls;
    }
    
    // Méthode pour obtenir l'URL de la miniature
    public String getMainThumbnailUrl() {
        if (imageThumbnailUrl != null && !imageThumbnailUrl.isEmpty()) {
            return imageThumbnailUrl;
        }
        
        // Chercher dans VehiculeImages
        if (images != null) {
            for (VehiculeImage img : images) {
                if (img.isMain() && img.getThumbnailUrl() != null) {
                    return img.getThumbnailUrl();
                }
            }
        }
        
        return imageUrl != null ? imageUrl : "";
    }
    
    // ========== MÉTHODES POUR LE FRONTEND ==========
    
    public String getNomComplet() {
        return marque + " " + modele;
    }
    
    public String getPrixFormate() {
        return String.format("%,.0f FCFA", getPrixFinal().doubleValue());
    }
    
    public boolean isDisponible() {
        return quantite != null && quantite > 0;
    }
    
    public boolean isNouveau() {
        return dateStock != null && dateStock.isAfter(LocalDate.now().minusDays(30));
    }
    
    public boolean isElectrique() {
        return "ELECTRIQUE".equalsIgnoreCase(energie);
    }
    
    public boolean isAvecOptions() {
        return options != null && !options.isEmpty();
    }
    
    // ========== MÉTHODES POUR LA COMPATIBILITÉ ==========
    
    public void setAdditionalImages(List<String> additionalImages) {
        // Cette méthode est pour la compatibilité avec le code existant
        // Les images additionnelles sont stockées dans la liste 'images'
    }
    
    public List<String> getAdditionalImages() {
        // Récupérer les URLs des images additionnelles (non principales)
        List<String> urls = new ArrayList<>();
        if (images != null) {
            for (VehiculeImage img : images) {
                if (!img.isMain() && img.getFileUrl() != null) {
                    urls.add(img.getFileUrl());
                }
            }
        }
        return urls;
    }
    
    // ========== GETTERS/SETTERS MANQUANTS ==========
    
    public void setEnSolde(boolean enSolde) {
        this.enSolde = enSolde;
    }
    
    public void setPourcentageSolde(BigDecimal pourcentageSolde) {
        this.pourcentageSolde = pourcentageSolde;
    }
}