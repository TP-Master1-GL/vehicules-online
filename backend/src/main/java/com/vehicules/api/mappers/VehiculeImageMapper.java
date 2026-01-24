package com.vehicules.api.mappers;

import com.vehicules.api.dto.VehiculeImageDTO;
import com.vehicules.core.entities.VehiculeImage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class VehiculeImageMapper {
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    public VehiculeImageDTO toDto(VehiculeImage entity) {
        if (entity == null) {
            return null;
        }
        
        VehiculeImageDTO dto = new VehiculeImageDTO();
        dto.setId(entity.getId());
        dto.setFileName(entity.getFileName());
        
        // IMPORTANT: S'assurer que les URLs sont absolues
        String fileUrl = entity.getFileUrl();
        if (fileUrl != null && !fileUrl.isEmpty()) {
            // Si l'URL n'est pas absolue, la construire
            if (!fileUrl.startsWith("http")) {
                String filename = extractFilenameFromUrl(fileUrl);
                if (filename != null && !filename.isEmpty()) {
                    fileUrl = baseUrl + "/api/images/vehicule/" + filename;
                }
            }
        }
        dto.setFileUrl(fileUrl);
        
        // Même chose pour la miniature
        String thumbnailUrl = entity.getThumbnailUrl();
        if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
            if (!thumbnailUrl.startsWith("http")) {
                String thumbFilename = extractFilenameFromUrl(thumbnailUrl);
                if (thumbFilename != null && !thumbFilename.isEmpty()) {
                    thumbnailUrl = baseUrl + "/api/images/vehicule/" + thumbFilename;
                }
            }
        }
        dto.setThumbnailUrl(thumbnailUrl);
        
        // Utiliser la méthode utilitaire isMain() qui gère correctement le Boolean
        dto.setMain(entity.isMain());
        
        dto.setFileSize(entity.getFileSize());
        dto.setFileType(entity.getFileType());
        dto.setUploadDate(entity.getUploadDate());
        dto.setUploadOrder(entity.getUploadOrder());
        
        return dto;
    }
    
    public VehiculeImage toEntity(VehiculeImageDTO dto) {
        if (dto == null) {
            return null;
        }
        
        VehiculeImage entity = new VehiculeImage();
        entity.setId(dto.getId());
        entity.setFileName(dto.getFileName());
        
        // Pour l'entité, on peut stocker soit l'URL absolue soit relative
        // Mais il est préférable de stocker l'URL relative
        if (dto.getFileUrl() != null && !dto.getFileUrl().isEmpty()) {
            String filename = extractFilenameFromUrl(dto.getFileUrl());
            if (filename != null && !filename.isEmpty()) {
                entity.setFileUrl("/api/images/vehicule/" + filename);
            } else {
                entity.setFileUrl(dto.getFileUrl());
            }
        }
        
        if (dto.getThumbnailUrl() != null && !dto.getThumbnailUrl().isEmpty()) {
            String thumbFilename = extractFilenameFromUrl(dto.getThumbnailUrl());
            if (thumbFilename != null && !thumbFilename.isEmpty()) {
                entity.setThumbnailUrl("/api/images/vehicule/" + thumbFilename);
            } else {
                entity.setThumbnailUrl(dto.getThumbnailUrl());
            }
        }
        
        // boolean -> Boolean
        entity.setMain(dto.isMain());
        
        entity.setFileSize(dto.getFileSize());
        entity.setFileType(dto.getFileType());
        entity.setUploadDate(dto.getUploadDate());
        entity.setUploadOrder(dto.getUploadOrder());
        
        return entity;
    }
    
    // Méthode utilitaire pour extraire le nom de fichier d'une URL
    private String extractFilenameFromUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return null;
        }
        
        // Supprimer les paramètres de requête
        String cleanUrl = fileUrl.split("\\?")[0];
        
        // Extraire le dernier segment
        String[] parts = cleanUrl.split("/");
        String filename = parts[parts.length - 1];
        
        // Vérifier que c'est un nom de fichier valide (contient une extension)
        if (filename.contains(".") && filename.length() > 3) {
            return filename;
        }
        
        // Si ce n'est pas un nom de fichier valide, retourner null
        return null;
    }
    
    // Méthode pour s'assurer qu'une URL est absolue
    public String ensureAbsoluteUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return null;
        }
        
        if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
            return fileUrl; // Déjà absolue
        }
        
        String filename = extractFilenameFromUrl(fileUrl);
        if (filename != null && !filename.isEmpty()) {
            return baseUrl + "/api/images/vehicule/" + filename;
        }
        
        return fileUrl; // Retourner l'URL originale si on ne peut pas la transformer
    }
    
    // Méthode pour convertir une liste d'entités en DTOs
    public List<VehiculeImageDTO> toDtoList(List<VehiculeImage> entities) {
        if (entities == null || entities.isEmpty()) {
            return new ArrayList<>();
        }
        
        return entities.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}