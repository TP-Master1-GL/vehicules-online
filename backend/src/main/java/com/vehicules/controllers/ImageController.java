package com.vehicules.controllers;

import com.vehicules.core.entities.VehiculeImage;
import com.vehicules.services.VehiculeImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ImageController {

    private final VehiculeImageService vehiculeImageService;
    private final Path fileStorageLocation = Paths.get("uploads/vehicule-images").toAbsolutePath().normalize();

    /**
     * Récupérer une image par son nom de fichier
     */
    @GetMapping("/vehicule/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename, HttpServletRequest request) {
        try {
            log.info("🖼️ Demande d'image: {}", filename);
            
            // Construire le chemin complet
            Path filePath = fileStorageLocation.resolve(filename).normalize();
            
            // Vérifier que le chemin est sécurisé (pas de navigation en dehors du répertoire)
            if (!filePath.getParent().equals(fileStorageLocation.toAbsolutePath())) {
                log.warn("⚠️ Tentative d'accès non autorisé: {}", filename);
                return ResponseEntity.badRequest().build();
            }
            
            // Charger le fichier comme ressource
            Resource resource = new UrlResource(filePath.toUri());
            
            // Vérifier si le fichier existe
            if (!resource.exists() || !resource.isReadable()) {
                log.warn("⚠️ Image non trouvée ou illisible: {}", filename);
                return ResponseEntity.notFound().build();
            }
            
            // Déterminer le type de contenu
            String contentType = null;
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException ex) {
                log.warn("⚠️ Impossible de déterminer le type de fichier: {}", filename);
            }
            
            // Type par défaut si non détecté
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            log.info("✅ Image servie: {} (Type: {})", filename, contentType);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            log.error("❌ Erreur lors du chargement de l'image {}: {}", filename, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Récupérer l'image principale d'un véhicule
     */
    @GetMapping("/vehicule/{vehiculeId}/main")
    public ResponseEntity<Resource> getMainImage(@PathVariable Long vehiculeId, HttpServletRequest request) {
        try {
            log.info("⭐ Demande image principale pour véhicule ID: {}", vehiculeId);
            
            // Récupérer l'image principale depuis le service
            VehiculeImage mainImage = vehiculeImageService.getMainImage(vehiculeId);
            
            if (mainImage == null) {
                log.warn("⚠️ Aucune image principale trouvée pour véhicule ID: {}", vehiculeId);
                return ResponseEntity.notFound().build();
            }
            
            String filename = extractFilenameFromUrl(mainImage.getFileUrl());
            return getImage(filename, request);
            
        } catch (Exception e) {
            log.error("❌ Erreur récupération image principale véhicule {}: {}", vehiculeId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Récupérer toutes les images d'un véhicule sous forme de ressources
     */
    @GetMapping("/vehicule/{vehiculeId}/all")
    public ResponseEntity<?> getAllVehiculeImages(@PathVariable Long vehiculeId) {
        try {
            log.info("📸 Demande toutes les images pour véhicule ID: {}", vehiculeId);
            
            List<VehiculeImage> images = vehiculeImageService.getVehiculeImages(vehiculeId);
            
            if (images.isEmpty()) {
                log.info("ℹ️ Aucune image trouvée pour véhicule ID: {}", vehiculeId);
                return ResponseEntity.ok().body(List.of());
            }
            
            // Construire la réponse avec les URLs complètes
            var imageResponses = images.stream()
                    .map(image -> {
                        String filename = extractFilenameFromUrl(image.getFileUrl());
                        String publicUrl = "/api/images/vehicule/" + filename;
                        
                        return new ImageResponse(
                                image.getId(),
                                image.getFileName(),
                                publicUrl,
                                image.isMain(),
                                image.getUploadOrder(),
                                image.getFileSize(),
                                image.getFileType(),
                                image.getUploadDate()
                        );
                    })
                    .toList();
            
            log.info("✅ {} images récupérées pour véhicule ID: {}", imageResponses.size(), vehiculeId);
            return ResponseEntity.ok(imageResponses);
            
        } catch (Exception e) {
            log.error("❌ Erreur récupération images véhicule {}: {}", vehiculeId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Erreur lors de la récupération des images: " + e.getMessage());
        }
    }

    /**
     * Service de santé des images
     */
    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        try {
            boolean directoryExists = Files.exists(fileStorageLocation);
            boolean isWritable = Files.isWritable(fileStorageLocation);
            
            var healthStatus = new HealthStatus(
                    "Image Service",
                    "UP",
                    directoryExists ? "OK" : "DIRECTORY_NOT_FOUND",
                    isWritable ? "WRITABLE" : "READ_ONLY",
                    fileStorageLocation.toString()
            );
            
            log.info("🩺 Statut service images: {}", healthStatus);
            return ResponseEntity.ok(healthStatus);
            
        } catch (Exception e) {
            log.error("❌ Erreur vérification santé service images: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(new HealthStatus("Image Service", "DOWN", e.getMessage()));
        }
    }

    /**
     * Classe de réponse pour les images
     */
    public record ImageResponse(
            Long id,
            String fileName,
            String fileUrl,
            boolean main,
            Integer uploadOrder,
            Long fileSize,
            String fileType,
            java.time.LocalDateTime uploadDate
    ) {}

    /**
     * Classe pour le statut de santé
     */
    public record HealthStatus(
            String service,
            String status,
            String message,
            String directoryPermission,
            String storagePath
    ) {
        public HealthStatus(String service, String status, String message) {
            this(service, status, message, "UNKNOWN", "UNKNOWN");
        }
    }

    /**
     * Extraire le nom de fichier d'une URL
     */
    private String extractFilenameFromUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return null;
        }
        // Supprimer le préfixe du chemin
        return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    }

    /**
     * Initialisation au démarrage
     */
    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Files.createDirectories(fileStorageLocation);
            log.info("📁 Répertoire d'images initialisé: {}", fileStorageLocation);
        } catch (IOException e) {
            log.error("❌ Impossible de créer le répertoire de stockage: {}", e.getMessage());
        }
    }
}