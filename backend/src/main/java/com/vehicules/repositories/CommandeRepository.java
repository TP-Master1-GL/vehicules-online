package com.vehicules.repositories;

import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    List<Commande> findByClientId(Long clientId);

    List<Commande> findByClient(Client client);

    List<Commande> findByStatut(String statut);

    @Query("SELECT c FROM Commande c WHERE c.dateCreation BETWEEN :dateDebut AND :dateFin")
    List<Commande> findCommandesBetweenDates(@Param("dateDebut") LocalDateTime dateDebut,
                                           @Param("dateFin") LocalDateTime dateFin);

}