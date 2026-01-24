package com.vehicules.repositories;

import com.vehicules.core.entities.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    
    // ========== MÉTHODES CORRIGÉES POUR ÉVITER MULTIPLE BAG FETCH ==========
    
    // Méthode 1: Fetch seulement les options (pas d'images)
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.options ORDER BY v.dateStock DESC")
    List<Vehicule> findAllWithOptions();
    
    // Méthode 2: Fetch seulement les images (pas d'options) - pour l'affichage catalogue
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.images ORDER BY v.dateStock DESC")
    List<Vehicule> findAllWithImages();
    
    // Méthode 3: Pour le détail d'un véhicule, on fait deux requêtes séparées
    // OU on utilise EntityGraph (solution recommandée)
    
    // Option A: Deux requêtes séparées
    @Query("SELECT v FROM Vehicule v LEFT JOIN FETCH v.images WHERE v.id = :id")
    Optional<Vehicule> findByIdWithImages(@Param("id") Long id);
    
    @Query("SELECT v FROM Vehicule v LEFT JOIN FETCH v.options WHERE v.id = :id")
    Optional<Vehicule> findByIdWithOptions(@Param("id") Long id);
    
    // Option B: Utiliser une seule requête avec DISTINCT (si vraiment nécessaire)
    @Query("SELECT DISTINCT v FROM Vehicule v " +
           "LEFT JOIN FETCH v.images " +
           "WHERE v.id = :id")
    Optional<Vehicule> findByIdWithImagesOnly(@Param("id") Long id);
    
    // Pour récupérer avec les deux collections (avec batch fetch)
    @Query("SELECT v FROM Vehicule v WHERE v.id = :id")
    Optional<Vehicule> findByIdForDetail(@Param("id") Long id);
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.options WHERE v.enSolde = :enSolde ORDER BY v.dateStock DESC")
    List<Vehicule> findByEnSoldeWithOptions(@Param("enSolde") Boolean enSolde);
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.images WHERE v.enSolde = :enSolde ORDER BY v.dateStock DESC")
    List<Vehicule> findByEnSoldeWithImages(@Param("enSolde") Boolean enSolde);
    
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.images WHERE v.dateStock > :dateLimite ORDER BY v.dateStock DESC")
    List<Vehicule> findNouveautesWithImages(@Param("dateLimite") LocalDate dateLimite);
    
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
    
    // ========== NOUVELLES MÉTHODES UTILES ==========
    
    // Pour la pagination avec images seulement
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.images")
    List<Vehicule> findAllWithImagesForCatalogue();
    
    // Pour les véhicules en solde avec images (affichage promotionnel)
    @Query("SELECT DISTINCT v FROM Vehicule v LEFT JOIN FETCH v.images WHERE v.enSolde = true ORDER BY v.pourcentageSolde DESC")
    List<Vehicule> findVehiculesEnSoldeWithImages();
}