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
    
    List<VehiculeImage> findByVehiculeId(Long vehiculeId);
    
    List<VehiculeImage> findByVehiculeIdAndIsMain(Long vehiculeId, boolean isMain);
    
    Optional<VehiculeImage> findByVehiculeIdAndIsMainTrue(Long vehiculeId);
    
    @Query("SELECT vi FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId ORDER BY vi.isMain DESC, vi.uploadOrder ASC, vi.uploadDate DESC")
    List<VehiculeImage> findByVehiculeIdOrdered(@Param("vehiculeId") Long vehiculeId);
    
    @Modifying
    @Query("DELETE FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId")
    void deleteByVehiculeId(@Param("vehiculeId") Long vehiculeId);
    
    @Modifying
    @Query("DELETE FROM VehiculeImage vi WHERE vi.vehicule.id = :vehiculeId AND vi.isMain = false")
    void deleteAdditionalImagesByVehiculeId(@Param("vehiculeId") Long vehiculeId);
    
    long countByVehiculeId(Long vehiculeId);
}