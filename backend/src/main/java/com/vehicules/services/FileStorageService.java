package com.vehicules.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    @Value("${app.upload.max-file-size:10485760}") // 10MB par défaut
    private long maxFileSize;
    
    @Value("${app.upload.allowed-extensions:jpg,jpeg,png,gif,webp}")
    private String[] allowedExtensions;
    
    public String storeFile(MultipartFile file, String subdirectory) throws IOException {
        // Vérifier la taille du fichier
        if (file.getSize() > maxFileSize) {
            throw new IOException("Fichier trop volumineux. Taille maximale: " + (maxFileSize / 1024 / 1024) + "MB");
        }
        
        // Vérifier l'extension
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            throw new IOException("Nom de fichier invalide");
        }
        
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();
        boolean extensionAllowed = false;
        for (String ext : allowedExtensions) {
            if (ext.equalsIgnoreCase(fileExtension)) {
                extensionAllowed = true;
                break;
            }
        }
        
        if (!extensionAllowed) {
            throw new IOException("Type de fichier non autorisé. Extensions autorisées: " + String.join(", ", allowedExtensions));
        }
        
        // Créer le répertoire s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir, subdirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Générer un nom de fichier unique
        String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);
        
        // Sauvegarder le fichier
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Retourner l'URL d'accès au fichier
        return baseUrl + "/uploads/" + subdirectory + "/" + uniqueFileName;
    }
    
    public String storeVehiculeImage(MultipartFile file, Long vehiculeId, boolean isMain) throws IOException {
        String subdirectory = isMain ? "vehicules/main" : "vehicules/additional";
        if (vehiculeId != null) {
            subdirectory += "/" + vehiculeId;
        }
        return storeFile(file, subdirectory);
    }
    
    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || !fileUrl.startsWith(baseUrl + "/uploads/")) {
            return;
        }
        
        // Extraire le chemin relatif
        String relativePath = fileUrl.substring((baseUrl + "/uploads/").length());
        Path filePath = Paths.get(uploadDir).resolve(relativePath);
        
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            
            // Essayer de supprimer les répertoires vides
            deleteEmptyDirectories(filePath.getParent());
        }
    }
    
    private void deleteEmptyDirectories(Path directory) throws IOException {
        if (directory != null && Files.exists(directory) && Files.isDirectory(directory)) {
            try (var stream = Files.list(directory)) {
                if (stream.findAny().isEmpty()) {
                    // Répertoire vide, le supprimer
                    Files.delete(directory);
                    // Essayer de supprimer le parent
                    deleteEmptyDirectories(directory.getParent());
                }
            }
        }
    }
    
    public String createThumbnail(String originalImageUrl, int width, int height) {
        // Pour une implémentation réelle, utiliser une bibliothèque comme Thumbnailator
        // Ici, nous retournons simplement la même URL avec des paramètres
        // En production, utilisez: https://github.com/coobird/thumbnailator
        
        if (originalImageUrl == null) return null;
        
        // Simulation: ajouter des paramètres de thumbnail
        return originalImageUrl + "?width=" + width + "&height=" + height + "&thumb=true";
    }
    
    // Getters pour la configuration
    public long getMaxFileSize() {
        return maxFileSize;
    }
    
    public String[] getAllowedExtensions() {
        return allowedExtensions;
    }
    
    public String getAllowedExtensionsString() {
        return String.join(", ", allowedExtensions);
    }
}