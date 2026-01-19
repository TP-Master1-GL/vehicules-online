package com.vehicules.repositories;

import com.vehicules.core.entities.VehiculeImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculeImageRepository extends JpaRepository<VehiculeImage, Long> {
    
    // Remplacer toutes les méthodes générées automatiquement par des @Query explicites
    
    @Query("SELECT vi FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId ORDER BY vi.isMain DESC, vi.uploadOrder ASC")
    List<VehiculeImage> findByVehiculeIdOrderByMainDescUploadOrderAsc(@Param("vehiculeId") Long vehiculeId);
    
    @Query("SELECT vi FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId AND vi.isMain = true")
    Optional<VehiculeImage> findFirstByVehiculeIdAndMainTrue(@Param("vehiculeId") Long vehiculeId);
    
    @Query("SELECT vi FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId AND vi.isMain = true")
    List<VehiculeImage> findByVehiculeIdAndMainTrue(@Param("vehiculeId") Long vehiculeId);
    
    @Query("SELECT MAX(vi.uploadOrder) FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId")
    Integer findMaxUploadOrderByVehiculeId(@Param("vehiculeId") Long vehiculeId);
    
    @Query("SELECT vi FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId")
    List<VehiculeImage> findByVehiculeId(@Param("vehiculeId") Long vehiculeId);
    
    @Query("SELECT vi FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId AND vi.isMain = :main")
    List<VehiculeImage> findByVehiculeIdAndMain(@Param("vehiculeId") Long vehiculeId, @Param("main") Boolean main);
    
    @Query("SELECT vi FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId ORDER BY vi.isMain DESC, vi.uploadOrder ASC, vi.uploadDate DESC")
    List<VehiculeImage> findByVehiculeIdOrdered(@Param("vehiculeId") Long vehiculeId);
    
    @Modifying
    @Query("DELETE FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId")
    void deleteByVehiculeId(@Param("vehiculeId") Long vehiculeId);
    
    @Modifying
    @Query("DELETE FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId AND vi.isMain = false")
    void deleteAdditionalImagesByVehiculeId(@Param("vehiculeId") Long vehiculeId);
    
    @Query("SELECT COUNT(vi) FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId")
    long countByVehiculeId(@Param("vehiculeId") Long vehiculeId);
}