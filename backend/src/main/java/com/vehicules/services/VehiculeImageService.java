package com.vehicules.services;

import com.vehicules.core.entities.Vehicule;
import com.vehicules.core.entities.VehiculeImage;
import com.vehicules.repositories.VehiculeImageRepository;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VehiculeImageService {
    
    private final VehiculeImageRepository vehiculeImageRepository;
    private final VehiculeRepository vehiculeRepository;
    private final FileStorageService fileStorageService;
    
    public VehiculeImage uploadMainImage(Long vehiculeId, MultipartFile file) throws IOException {
        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec ID: " + vehiculeId));
        
        // Supprimer l'ancienne image principale s'il y en a une
        vehiculeImageRepository.findByVehiculeIdAndIsMainTrue(vehiculeId)
                .ifPresent(this::deleteImageEntity);
        
        // Uploader la nouvelle image
        String fileUrl = fileStorageService.storeVehiculeImage(file, vehiculeId, true);
        String thumbnailUrl = fileStorageService.createThumbnail(fileUrl, 300, 200);
        
        // Créer l'entité image
        VehiculeImage image = new VehiculeImage();
        image.setFileName(file.getOriginalFilename());
        image.setFileUrl(fileUrl);
        image.setThumbnailUrl(thumbnailUrl);
        image.setFileSize(file.getSize());
        image.setFileType(file.getContentType());
        image.setMain(true);
        image.setVehicule(vehicule);
        image.setUploadOrder(0);
        
        VehiculeImage savedImage = vehiculeImageRepository.save(image);
        
        // Mettre à jour le véhicule avec l'URL de l'image principale
        vehicule.setImageUrl(fileUrl);
        vehicule.setImageThumbnailUrl(thumbnailUrl);
        vehiculeRepository.save(vehicule);
        
        return savedImage;
    }
    
    public VehiculeImage uploadAdditionalImage(Long vehiculeId, MultipartFile file) throws IOException {
        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec ID: " + vehiculeId));
        
        // Compter les images existantes pour déterminer l'ordre
        long imageCount = vehiculeImageRepository.countByVehiculeId(vehiculeId);
        
        // Uploader l'image
        String fileUrl = fileStorageService.storeVehiculeImage(file, vehiculeId, false);
        String thumbnailUrl = fileStorageService.createThumbnail(fileUrl, 200, 150);
        
        // Créer l'entité image
        VehiculeImage image = new VehiculeImage();
        image.setFileName(file.getOriginalFilename());
        image.setFileUrl(fileUrl);
        image.setThumbnailUrl(thumbnailUrl);
        image.setFileSize(file.getSize());
        image.setFileType(file.getContentType());
        image.setMain(false);
        image.setVehicule(vehicule);
        image.setUploadOrder((int) imageCount + 1);
        
        VehiculeImage savedImage = vehiculeImageRepository.save(image);
        
        // Ajouter à la liste des images supplémentaires du véhicule
        vehicule.addAdditionalImage(fileUrl);
        vehiculeRepository.save(vehicule);
        
        return savedImage;
    }
    
    public List<VehiculeImage> getVehiculeImages(Long vehiculeId) {
        return vehiculeImageRepository.findByVehiculeIdOrdered(vehiculeId);
    }
    
    public VehiculeImage getMainImage(Long vehiculeId) {
        return vehiculeImageRepository.findByVehiculeIdAndIsMainTrue(vehiculeId)
                .orElse(null);
    }
    
    public void deleteImage(Long imageId) {
        VehiculeImage image = vehiculeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée avec ID: " + imageId));
        
        deleteImageEntity(image);
    }
    
    private void deleteImageEntity(VehiculeImage image) {
        try {
            // Supprimer le fichier physique
            fileStorageService.deleteFile(image.getFileUrl());
            if (image.getThumbnailUrl() != null) {
                fileStorageService.deleteFile(image.getThumbnailUrl());
            }
            
            Vehicule vehicule = image.getVehicule();
            
            // Mettre à jour le véhicule si c'était l'image principale
            if (image.isMain()) {
                vehicule.setImageUrl(null);
                vehicule.setImageThumbnailUrl(null);
            } else {
                // Retirer de la liste des images supplémentaires
                vehicule.removeAdditionalImage(image.getFileUrl());
            }
            
            vehiculeRepository.save(vehicule);
            vehiculeImageRepository.delete(image);
            
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la suppression du fichier: " + e.getMessage(), e);
        }
    }
    
    public void deleteAllVehiculeImages(Long vehiculeId) {
        List<VehiculeImage> images = vehiculeImageRepository.findByVehiculeId(vehiculeId);
        images.forEach(this::deleteImageEntity);
    }
    
    public void setImageAsMain(Long imageId) {
        VehiculeImage newMainImage = vehiculeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image non trouvée avec ID: " + imageId));
        
        Long vehiculeId = newMainImage.getVehicule().getId();
        
        // Désactiver l'ancienne image principale
        vehiculeImageRepository.findByVehiculeIdAndIsMainTrue(vehiculeId)
                .ifPresent(oldMainImage -> {
                    oldMainImage.setMain(false);
                    vehiculeImageRepository.save(oldMainImage);
                });
        
        // Définir la nouvelle image comme principale
        newMainImage.setMain(true);
        newMainImage.setUploadOrder(0);
        vehiculeImageRepository.save(newMainImage);
        
        // Mettre à jour le véhicule
        Vehicule vehicule = newMainImage.getVehicule();
        vehicule.setImageUrl(newMainImage.getFileUrl());
        vehicule.setImageThumbnailUrl(newMainImage.getThumbnailUrl());
        vehiculeRepository.save(vehicule);
    }
    
    public void reorderImages(Long vehiculeId, List<Long> imageIdsInOrder) {
        List<VehiculeImage> images = vehiculeImageRepository.findByVehiculeId(vehiculeId);
        
        for (int i = 0; i < imageIdsInOrder.size(); i++) {
            Long imageId = imageIdsInOrder.get(i);
            for (VehiculeImage image : images) {
                if (image.getId().equals(imageId)) {
                    image.setUploadOrder(i + 1); // +1 car l'image principale est à l'ordre 0
                    vehiculeImageRepository.save(image);
                    break;
                }
            }
        }
    }
}