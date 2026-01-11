package com.vehicules.repositories;

import com.vehicules.core.entities.Vehicule; // CHANGÉ: de entities à core.entities
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {

    @Query("SELECT v FROM Vehicule v WHERE v.enSolde = true")
    List<Vehicule> findVehiculesEnSolde();

    List<Vehicule> findByEnSolde(boolean enSolde);

    List<Vehicule> findByDateStockBefore(LocalDate date);

    @Query("SELECT v FROM Vehicule v WHERE v.prixBase BETWEEN :prixMin AND :prixMax")
    List<Vehicule> findVehiculesByPrixRange(@Param("prixMin") BigDecimal prixMin, 
                                           @Param("prixMax") BigDecimal prixMax);

    List<Vehicule> findByMarque(String marque);
    
    List<Vehicule> findByModeleContaining(String modele);
}