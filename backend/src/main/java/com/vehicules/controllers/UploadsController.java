package com.vehicules.controllers;

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
import java.util.Arrays;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:3001"})
public class UploadsController {

    private final Path uploadsLocation = Paths.get("uploads").toAbsolutePath().normalize();
    
    // Formats d'image supportés
    private static final List<String> SUPPORTED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"
    );

    /**
     * Endpoint principal pour servir les images de véhicules
     */
    @GetMapping("/vehicules/main/{vehiculeId}/{filename:.+}")
    public ResponseEntity<Resource> serveVehiculeImage(
            @PathVariable Long vehiculeId,
            @PathVariable String filename,
            HttpServletRequest request) {
        
        try {
            log.info("🖼️ Demande image: vehiculeId={}, filename={}", vehiculeId, filename);
            
            // Construire le chemin complet
            Path filePath = uploadsLocation
                    .resolve("vehicules/main/" + vehiculeId + "/" + filename)
                    .normalize();
            
            log.info("📁 Chemin fichier: {}", filePath);
            
            // Vérifier que le fichier existe
            if (!Files.exists(filePath)) {
                log.warn("⚠️ Fichier non trouvé: {}", filePath);
                // Essayez d'autres emplacements
                return tryAlternativeLocations(filename, vehiculeId, request);
            }
            
            // Vérifier la sécurité du chemin
            if (!isPathSafe(filePath)) {
                log.error("❌ Chemin non sécurisé: {}", filePath);
                return ResponseEntity.badRequest().build();
            }
            
            // Charger le fichier comme ressource
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                log.warn("⚠️ Fichier non lisible: {}", filePath);
                return ResponseEntity.notFound().build();
            }
            
            // Déterminer le type de contenu
            String contentType = determineContentType(filePath, filename);
            
            log.info("✅ Image servie: {} (Type: {})", filename, contentType);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    // Headers CORS explicites
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Access-Control-Allow-Methods", "GET, OPTIONS")
                    .header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
                    .header("Access-Control-Allow-Credentials", "true")
                    .header("Access-Control-Max-Age", "3600")
                    .body(resource);
                    
        } catch (Exception e) {
            log.error("❌ Erreur servie image: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }
    }
    
    /**
     * Gestionnaire OPTIONS pour CORS preflight
     */
    @RequestMapping(value = "/vehicules/main/{vehiculeId}/{filename:.+}", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
                .header("Access-Control-Max-Age", "3600")
                .build();
    }
    
    /**
     * Endpoint pour servir les images directement par nom de fichier
     * (Sans le pattern problématique /**/
     
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImageByName(
            @PathVariable String filename,
            HttpServletRequest request) {
        
        try {
            log.info("📄 Demande image par nom: filename={}", filename);
            
            // Chercher dans différents répertoires
            String[] searchPaths = {
                filename, // directement
                "vehicule-images/" + filename,
                "images/" + filename
            };
            
            for (String searchPath : searchPaths) {
                Path filePath = uploadsLocation.resolve(searchPath).normalize();
                
                if (Files.exists(filePath) && isPathSafe(filePath)) {
                    Resource resource = new UrlResource(filePath.toUri());
                    
                    if (resource.exists() && resource.isReadable()) {
                        String contentType = determineContentType(filePath, filename);
                        
                        log.info("✅ Image trouvée: {}", filePath);
                        
                        return ResponseEntity.ok()
                                .contentType(MediaType.parseMediaType(contentType))
                                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                                .header("Access-Control-Allow-Origin", "*")
                                .body(resource);
                    }
                }
            }
            
            log.warn("⚠️ Image non trouvée: {}", filename);
            return ResponseEntity.notFound().build();
                    
        } catch (Exception e) {
            log.error("❌ Erreur image par nom: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }
    }
    
    /**
     * Vérifie l'état du répertoire d'uploads
     */
    @GetMapping("/health")
    public ResponseEntity<?> checkUploadsDirectory() {
        try {
            boolean exists = Files.exists(uploadsLocation);
            boolean isDirectory = Files.isDirectory(uploadsLocation);
            boolean isReadable = Files.isReadable(uploadsLocation);
            boolean isWritable = Files.isWritable(uploadsLocation);
            
            var status = new UploadsStatus(
                    exists,
                    isDirectory,
                    isReadable,
                    isWritable,
                    uploadsLocation.toString()
            );
            
            log.info("🩺 Statut uploads: {}", status);
            return ResponseEntity.ok(status);
            
        } catch (Exception e) {
            log.error("❌ Erreur vérification répertoire: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(new UploadsStatus(false, false, false, false, e.getMessage()));
        }
    }
    
    /**
     * Liste les fichiers dans un répertoire spécifique
     * (Version simplifiée sans pattern complexe)
     */
    @GetMapping("/list")
    public ResponseEntity<?> listFilesInUploads() {
        try {
            if (!Files.exists(uploadsLocation) || !Files.isDirectory(uploadsLocation)) {
                return ResponseEntity.ok(List.of());
            }
            
            var files = Files.list(uploadsLocation)
                    .map(path -> {
                        try {
                            return new FileInfo(
                                    path.getFileName().toString(),
                                    Files.isDirectory(path),
                                    Files.size(path),
                                    Files.getLastModifiedTime(path).toMillis()
                            );
                        } catch (IOException e) {
                            log.warn("⚠️ Erreur récupération infos fichier {}: {}", path, e.getMessage());
                            return new FileInfo(
                                    path.getFileName().toString(),
                                    Files.isDirectory(path),
                                    0,
                                    System.currentTimeMillis()
                            );
                        }
                    })
                    .toList();
            
            return ResponseEntity.ok()
                    .header("Access-Control-Allow-Origin", "*")
                    .body(files);
                    
        } catch (Exception e) {
            log.error("❌ Erreur liste fichiers: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }
    }
    
    /**
     * Essaie d'autres emplacements pour le fichier
     */
    private ResponseEntity<Resource> tryAlternativeLocations(String filename, Long vehiculeId, HttpServletRequest request) {
        try {
            // Essayez différents chemins possibles
            String[] alternativePaths = {
                "vehicules/main/" + vehiculeId + "/" + filename,
                "vehicules/" + vehiculeId + "/" + filename,
                "vehicule-images/" + filename,
                "images/vehicules/" + filename,
                filename
            };
            
            for (String altPath : alternativePaths) {
                Path filePath = uploadsLocation.resolve(altPath).normalize();
                if (Files.exists(filePath) && isPathSafe(filePath)) {
                    log.info("✅ Fichier trouvé dans: {}", altPath);
                    
                    Resource resource = new UrlResource(filePath.toUri());
                    String contentType = determineContentType(filePath, filename);
                    
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                            .header("Access-Control-Allow-Origin", "*")
                            .body(resource);
                }
            }
            
            log.warn("⚠️ Fichier non trouvé dans aucun emplacement: {}", filename);
            return ResponseEntity.notFound()
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
            
        } catch (Exception e) {
            log.error("❌ Erreur recherche alternative: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }
    }
    
    /**
     * Détermine le type de contenu
     */
    private String determineContentType(Path filePath, String filename) {
        try {
            String contentType = Files.probeContentType(filePath);
            
            if (contentType == null) {
                // Déterminer par extension
                String lowerFilename = filename.toLowerCase();
                if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (lowerFilename.endsWith(".png")) {
                    contentType = "image/png";
                } else if (lowerFilename.endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (lowerFilename.endsWith(".webp")) {
                    contentType = "image/webp";
                } else if (lowerFilename.endsWith(".svg")) {
                    contentType = "image/svg+xml";
                } else {
                    contentType = "application/octet-stream";
                }
            }
            
            // Valider que c'est un type d'image supporté
            if (!SUPPORTED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
                log.warn("⚠️ Type de fichier non supporté: {}", contentType);
                contentType = "application/octet-stream";
            }
            
            return contentType;
            
        } catch (IOException e) {
            log.warn("⚠️ Erreur détermination type de contenu: {}", e.getMessage());
            return "application/octet-stream";
        }
    }
    
    /**
     * Vérifie la sécurité du chemin
     */
    private boolean isPathSafe(Path filePath) {
        try {
            Path normalizedPath = filePath.normalize().toAbsolutePath();
            Path normalizedRoot = uploadsLocation.normalize().toAbsolutePath();
            
            // Empêche la navigation en dehors du répertoire racine
            return normalizedPath.startsWith(normalizedRoot);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Enregistrement pour le statut des uploads
     */
    public record UploadsStatus(
            boolean exists,
            boolean isDirectory,
            boolean isReadable,
            boolean isWritable,
            String path
    ) {
        @Override
        public String toString() {
            return String.format(
                    "UploadsStatus[exists=%s, dir=%s, readable=%s, writable=%s, path=%s]",
                    exists, isDirectory, isReadable, isWritable, path
            );
        }
    }
    
    /**
     * Enregistrement pour les informations de fichier
     */
    public record FileInfo(
            String name,
            boolean isDirectory,
            long size,
            long lastModified
    ) {
        public String getSizeFormatted() {
            if (size < 1024) return size + " B";
            if (size < 1024 * 1024) return (size / 1024) + " KB";
            return String.format("%.2f MB", size / (1024.0 * 1024.0));
        }
        
        public String getLastModifiedFormatted() {
            return new java.util.Date(lastModified).toString();
        }
    }
    
    /**
     * Initialisation du contrôleur
     */
    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            if (!Files.exists(uploadsLocation)) {
                Files.createDirectories(uploadsLocation);
                log.info("📁 Répertoire uploads créé: {}", uploadsLocation);
            }
            
            // Créer les sous-répertoires courants
            Path[] subDirs = {
                uploadsLocation.resolve("vehicules/main"),
                uploadsLocation.resolve("vehicule-images"),
                uploadsLocation.resolve("images")
            };
            
            for (Path subDir : subDirs) {
                if (!Files.exists(subDir)) {
                    Files.createDirectories(subDir);
                    log.info("📁 Sous-répertoire créé: {}", subDir);
                }
            }
            
            log.info("🚀 UploadsController initialisé. Chemin: {}", uploadsLocation);
            
        } catch (IOException e) {
            log.error("❌ Erreur initialisation UploadsController: {}", e.getMessage(), e);
            throw new RuntimeException("Impossible d'initialiser le répertoire d'uploads", e);
        }
    }
}