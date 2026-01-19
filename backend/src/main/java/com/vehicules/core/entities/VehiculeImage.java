package com.vehicules.core.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicule_image")
@Data
@NoArgsConstructor
public class VehiculeImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "file_name")
    private String fileName;
    
    @Column(name = "file_url", length = 500)
    private String fileUrl;
    
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    
    // CHANGEMENT: Utiliser Boolean au lieu de boolean
    @Column(name = "is_main")
    private Boolean isMain = false;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
    
    @Column(name = "upload_order")
    private Integer uploadOrder;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;
    
    // CHANGEMENT: Ajouter explicitement getMain() et setMain() pour JPA
    public Boolean getMain() {
        return isMain;
    }
    
    public void setMain(Boolean main) {
        this.isMain = main;
    }
    
    // Méthode utilitaire pour compatibilité
    public boolean isMain() {
        return Boolean.TRUE.equals(isMain);
    }
}