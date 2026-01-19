package com.vehicules.services;

import com.vehicules.core.entities.Vehicule;
import com.vehicules.core.entities.VehiculeImage;
import com.vehicules.repositories.VehiculeImageRepository;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class VehiculeImageService {
    
    private final VehiculeImageRepository vehiculeImageRepository;
    private final VehiculeRepository vehiculeRepository;
    
    @Value("${app.upload.vehicule-images-directory:./uploads/vehicule-images}")
    private String uploadDirectory;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    private Path rootLocation;
    
    @PostConstruct
    public void init() {
        try {
            this.rootLocation = Paths.get(uploadDirectory).toAbsolutePath().normalize();
            Files.createDirectories(rootLocation);
            log.info("📁 Répertoire d'images initialisé: {}", rootLocation);
            log.info("🌐 Base URL: {}", baseUrl);
        } catch (IOException e) {
            log.error("❌ Erreur initialisation répertoire d'upload: {}", e.getMessage(), e);
            throw new RuntimeException("Impossible de créer le répertoire de stockage: " + e.getMessage(), e);
        }
    }
    
    /**
     * Génère l'URL publique complète pour une image
     */
    private String generatePublicImageUrl(String filename) {
        return baseUrl + "/api/images/vehicule/" + filename;
    }
    
    /**
     * Upload d'une image principale
     */
    public VehiculeImage uploadMainImage(Long vehiculeId, MultipartFile file) {
        try {
            log.info("📤 Upload image principale pour véhicule ID: {}", vehiculeId);
            log.info("📁 Fichier: {} ({} bytes)", file.getOriginalFilename(), file.getSize());
            
            // Vérifier le véhicule
            Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                    .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec ID: " + vehiculeId));
            
            // Générer un nom de fichier unique
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            
            log.info("🆔 Nom de fichier généré: {}", filename);
            
            // Sauvegarder le fichier sur le disque
            Path destinationFile = rootLocation.resolve(Paths.get(filename)).normalize().toAbsolutePath();
            file.transferTo(destinationFile.toFile());
            log.info("💾 Fichier sauvegardé: {}", destinationFile);
            
            // Désactiver l'ancienne image principale si elle existe
            Optional<VehiculeImage> existingMainImageOpt = vehiculeImageRepository.findFirstByVehiculeIdAndMainTrue(vehiculeId);
            if (existingMainImageOpt.isPresent()) {
                VehiculeImage existingMainImage = existingMainImageOpt.get();
                existingMainImage.setMain(false);
                vehiculeImageRepository.save(existingMainImage);
                log.info("🔄 Ancienne image principale désactivée: {}", existingMainImage.getId());
            }
            
            // Créer l'entité image
            VehiculeImage image = new VehiculeImage();
            image.setFileName(originalFilename);
            
            // URL publique complète
            String publicUrl = generatePublicImageUrl(filename);
            image.setFileUrl(publicUrl);
            image.setThumbnailUrl(publicUrl); // Même URL pour la vignette (pour l'instant)
            
            image.setMain(true);
            image.setFileSize(file.getSize());
            image.setFileType(file.getContentType());
            image.setUploadDate(LocalDateTime.now());
            image.setVehicule(vehicule);
            image.setUploadOrder(0);
            
            VehiculeImage savedImage = vehiculeImageRepository.save(image);
            log.info("✅ Image principale uploadée avec ID: {}", savedImage.getId());
            log.info("🔗 URL publique: {}", savedImage.getFileUrl());
            
            return savedImage;
            
        } catch (Exception e) {
            log.error("❌ Erreur upload image principale véhicule {}: {}", vehiculeId, e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'upload de l'image principale: " + e.getMessage(), e);
        }
    }
    
    /**
     * Upload d'une image additionnelle
     */
    public VehiculeImage uploadAdditionalImage(Long vehiculeId, MultipartFile file) {
        try {
            log.info("📤 Upload image additionnelle pour véhicule ID: {}", vehiculeId);
            log.info("📁 Fichier: {} ({} bytes)", file.getOriginalFilename(), file.getSize());
            
            // Vérifier le véhicule
            Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                    .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec ID: " + vehiculeId));
            
            // Générer un nom de fichier unique
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            
            log.info("🆔 Nom de fichier généré: {}", filename);
            
            // Sauvegarder le fichier sur le disque
            Path destinationFile = rootLocation.resolve(Paths.get(filename)).normalize().toAbsolutePath();
            file.transferTo(destinationFile.toFile());
            log.info("💾 Fichier sauvegardé: {}", destinationFile);
            
            // Déterminer l'ordre d'upload
            Integer maxOrder = vehiculeImageRepository.findMaxUploadOrderByVehiculeId(vehiculeId);
            int nextOrder = (maxOrder != null ? maxOrder + 1 : 1);
            log.info("🔢 Ordre d'upload: {}", nextOrder);
            
            // Créer l'entité image
            VehiculeImage image = new VehiculeImage();
            image.setFileName(originalFilename);
            
            // URL publique complète
            String publicUrl = generatePublicImageUrl(filename);
            image.setFileUrl(publicUrl);
            image.setThumbnailUrl(publicUrl); // Même URL pour la vignette
            
            image.setMain(false);
            image.setFileSize(file.getSize());
            image.setFileType(file.getContentType());
            image.setUploadDate(LocalDateTime.now());
            image.setUploadOrder(nextOrder);
            image.setVehicule(vehicule);
            
            VehiculeImage savedImage = vehiculeImageRepository.save(image);
            log.info("✅ Image additionnelle uploadée avec ID: {}", savedImage.getId());
            log.info("🔗 URL publique: {}", savedImage.getFileUrl());
            
            return savedImage;
            
        } catch (Exception e) {
            log.error("❌ Erreur upload image additionnelle véhicule {}: {}", vehiculeId, e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'upload de l'image additionnelle: " + e.getMessage(), e);
        }
    }
    
    /**
     * Récupérer toutes les images d'un véhicule
     */
    public List<VehiculeImage> getVehiculeImages(Long vehiculeId) {
        log.info("📸 Récupération images pour véhicule ID: {}", vehiculeId);
        List<VehiculeImage> images = vehiculeImageRepository.findByVehiculeIdOrderByMainDescUploadOrderAsc(vehiculeId);
        log.info("✅ {} images récupérées pour véhicule ID: {}", images.size(), vehiculeId);
        return images;
    }
    
    /**
     * Récupérer l'image principale d'un véhicule
     */
    public VehiculeImage getMainImage(Long vehiculeId) {
        log.info("⭐ Recherche image principale pour véhicule ID: {}", vehiculeId);
        VehiculeImage mainImage = vehiculeImageRepository.findFirstByVehiculeIdAndMainTrue(vehiculeId)
                .orElse(null);
        
        if (mainImage != null) {
            log.info("✅ Image principale trouvée: {}", mainImage.getId());
        } else {
            log.warn("⚠️ Aucune image principale trouvée pour véhicule ID: {}", vehiculeId);
        }
        
        return mainImage;
    }
    
    /**
     * Supprimer une image
     */
    public void deleteImage(Long imageId) {
        log.info("🗑️ Suppression image ID: {}", imageId);
        
        VehiculeImage image = vehiculeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée avec ID: " + imageId));
        
        // Supprimer la référence dans le véhicule
        Vehicule vehicule = image.getVehicule();
        if (vehicule != null && vehicule.getImages() != null) {
            vehicule.getImages().removeIf(img -> img.getId().equals(imageId));
        }
        
        // Supprimer le fichier physique
        try {
            String fileUrl = image.getFileUrl();
            if (fileUrl != null) {
                // Extraire le nom de fichier de l'URL
                String filename = extractFilenameFromUrl(fileUrl);
                if (filename != null) {
                    Path filePath = rootLocation.resolve(filename);
                    boolean deleted = Files.deleteIfExists(filePath);
                    if (deleted) {
                        log.info("🗑️ Fichier physique supprimé: {}", filename);
                    } else {
                        log.warn("⚠️ Fichier physique non trouvé: {}", filename);
                    }
                }
            }
        } catch (IOException e) {
            log.error("⚠️ Impossible de supprimer le fichier physique: {}", e.getMessage());
        }
        
        // Supprimer de la base de données
        vehiculeImageRepository.deleteById(imageId);
        log.info("✅ Image ID {} supprimée", imageId);
    }
    
    /**
     * Supprimer toutes les images d'un véhicule
     */
    public void deleteAllVehiculeImages(Long vehiculeId) {
        log.info("🗑️ Suppression de toutes les images pour véhicule ID: {}", vehiculeId);
        List<VehiculeImage> images = vehiculeImageRepository.findByVehiculeId(vehiculeId);
        log.info("📊 {} images à supprimer", images.size());
        
        for (VehiculeImage image : images) {
            deleteImage(image.getId());
        }
        
        log.info("✅ Toutes les images supprimées pour véhicule ID: {}", vehiculeId);
    }
    
    /**
     * Définir une image comme principale
     */
    public void setImageAsMain(Long imageId) {
        log.info("⭐ Définition image ID {} comme principale", imageId);
        
        VehiculeImage image = vehiculeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée avec ID: " + imageId));
        
        Long vehiculeId = image.getVehicule().getId();
        
        // Désactiver toutes les images principales existantes
        List<VehiculeImage> mainImages = vehiculeImageRepository.findByVehiculeIdAndMainTrue(vehiculeId);
        for (VehiculeImage mainImage : mainImages) {
            if (!mainImage.getId().equals(imageId)) {
                mainImage.setMain(false);
                vehiculeImageRepository.save(mainImage);
                log.info("🔄 Image ID {} désactivée comme principale", mainImage.getId());
            }
        }
        
        // Définir cette image comme principale
        image.setMain(true);
        image.setUploadOrder(0);
        vehiculeImageRepository.save(image);
        
        log.info("✅ Image ID {} définie comme principale", imageId);
    }
    
    /**
     * Extraire le nom de fichier d'une URL
     */
    private String extractFilenameFromUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return null;
        }
        try {
            // URL complète: http://localhost:8080/api/images/vehicule/filename.jpg
            String[] parts = fileUrl.split("/");
            return parts[parts.length - 1];
        } catch (Exception e) {
            log.warn("⚠️ Impossible d'extraire le nom de fichier de l'URL: {}", fileUrl);
            return null;
        }
    }
    
    /**
     * Migrer les URLs d'images existantes (utile pour les anciennes données)
     */
    public int migrateExistingImageUrls() {
        log.info("🔄 Migration des URLs d'images existantes...");
        List<VehiculeImage> images = vehiculeImageRepository.findAll();
        int migrated = 0;
        
        for (VehiculeImage image : images) {
            String oldUrl = image.getFileUrl();
            
            // Si l'URL est relative (commence par /uploads/)
            if (oldUrl != null && oldUrl.startsWith("/uploads/")) {
                String filename = extractFilenameFromUrl(oldUrl);
                if (filename != null) {
                    String newUrl = generatePublicImageUrl(filename);
                    image.setFileUrl(newUrl);
                    image.setThumbnailUrl(newUrl);
                    vehiculeImageRepository.save(image);
                    migrated++;
                    log.info("🔄 URL migrée: {} -> {}", oldUrl, newUrl);
                }
            }
        }
        
        log.info("✅ Migration terminée: {} URLs migrées", migrated);
        return migrated;
    }
    
    /**
     * Vérifier si un fichier existe
     */
    public boolean fileExists(String filename) {
        try {
            Path filePath = rootLocation.resolve(filename).normalize();
            return Files.exists(filePath);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Obtenir le chemin absolu d'un fichier
     */
    public String getFilePath(String filename) {
        try {
            Path filePath = rootLocation.resolve(filename).normalize();
            return filePath.toString();
        } catch (Exception e) {
            log.error("❌ Erreur obtention chemin fichier {}: {}", filename, e.getMessage());
            return null;
        }
    }
}