package com.vehicules.repositories;

import com.vehicules.core.entities.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    
    // ========== MÉTHODES AVEC JOIN FETCH (ESSENTIELLES) ==========
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.options ORDER BY v.dateStock DESC")
    List<Vehicule> findAllWithOptions();
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.options LEFT JOIN FETCH v.images ORDER BY v.dateStock DESC")
    List<Vehicule> findAllWithOptionsAndImages();
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.options WHERE v.enSolde = :enSolde ORDER BY v.dateStock DESC")
    List<Vehicule> findByEnSoldeWithOptions(@Param("enSolde") Boolean enSolde);
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.options WHERE v.dateStock > :dateLimite ORDER BY v.dateStock DESC")
    List<Vehicule> findNouveautesWithOptions(@Param("dateLimite") LocalDate dateLimite);
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.options LEFT JOIN FETCH v.images WHERE v.id = :id")
    Vehicule findByIdWithAllRelations(@Param("id") Long id);
    
    // ========== MÉTHODES DE COMPTAGE ==========
    
    long countByEnSolde(Boolean enSolde);
    
    long countByDateStockGreaterThan(LocalDate date);
    
    long countByEnergie(String energie);
    
    // ========== MÉTHODES EXISTANTES ==========
    
    List<Vehicule> findByEnSolde(Boolean enSolde);
    
    List<Vehicule> findByDateStockBefore(LocalDate date);
    
    List<Vehicule> findByDateStockGreaterThan(LocalDate date);
    
    @Query("SELECT v FROM Vehicule v WHERE v.enSolde = true ORDER BY v.dateStock DESC")
    List<Vehicule> findVehiculesEnSolde();
    
    @Query("SELECT v FROM Vehicule v WHERE v.dateStock > :dateLimite ORDER BY v.dateStock DESC")
    List<Vehicule> findNouveautes(@Param("dateLimite") LocalDate dateLimite);
    
    // RECHERCHE PAR TYPE
    @Query("SELECT v FROM Vehicule v WHERE TYPE(v) IN (:types) ORDER BY v.dateStock DESC")
    List<Vehicule> findByTypes(@Param("types") List<Class<? extends Vehicule>> types);
    
    // Recherche simplifiée par type
    @Query("SELECT v FROM Vehicule v WHERE TYPE(v) = :type ORDER BY v.dateStock DESC")
    List<Vehicule> findByTypeClass(@Param("type") Class<? extends Vehicule> type);
    
    // Recherche par marque
    List<Vehicule> findByMarque(String marque);
    
    // Recherche par prix
    List<Vehicule> findByPrixBaseBetween(BigDecimal prixMin, BigDecimal prixMax);
    
    // Recherche avancée
    @Query("SELECT v FROM Vehicule v WHERE v.marque LIKE %:marque% AND v.quantite > 0 ORDER BY v.dateStock DESC")
    List<Vehicule> findByMarqueContainingAndDisponible(@Param("marque") String marque);
    
    // Recherche par marque et modèle
    @Query("SELECT v FROM Vehicule v WHERE UPPER(v.marque) LIKE UPPER(CONCAT('%', :marque, '%')) OR UPPER(v.modele) LIKE UPPER(CONCAT('%', :modele, '%')) ORDER BY v.dateStock DESC")
    List<Vehicule> findByMarqueOrModeleContaining(@Param("marque") String marque, @Param("modele") String modele);
    
    // Recherche par date de stock
    @Query("SELECT v FROM Vehicule v WHERE v.dateStock BETWEEN :dateDebut AND :dateFin ORDER BY v.dateStock DESC")
    List<Vehicule> findByDateStockBetween(@Param("dateDebut") LocalDate dateDebut, @Param("dateFin") LocalDate dateFin);
}