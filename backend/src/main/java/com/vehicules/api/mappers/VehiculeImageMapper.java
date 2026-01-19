package com.vehicules.api.mappers;

import com.vehicules.api.dto.VehiculeImageDTO;
import com.vehicules.core.entities.VehiculeImage;
import org.springframework.stereotype.Component;

@Component
public class VehiculeImageMapper {
    
    public VehiculeImageDTO toDto(VehiculeImage entity) {
        if (entity == null) {
            return null;
        }
        
        VehiculeImageDTO dto = new VehiculeImageDTO();
        dto.setId(entity.getId());
        dto.setFileName(entity.getFileName());
        dto.setFileUrl(entity.getFileUrl());
        dto.setThumbnailUrl(entity.getThumbnailUrl());
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
        entity.setFileUrl(dto.getFileUrl());
        entity.setThumbnailUrl(dto.getThumbnailUrl());
        entity.setMain(dto.isMain());
        entity.setFileSize(dto.getFileSize());
        entity.setFileType(dto.getFileType());
        entity.setUploadDate(dto.getUploadDate());
        entity.setUploadOrder(dto.getUploadOrder());
        
        return entity;
    }
}