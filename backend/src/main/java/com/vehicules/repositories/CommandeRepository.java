package com.vehicules.repositories;


import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.Commande;
import com.vehicules.entities.Commande;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository extends JpaRepository<Commande, Long> {

    List<Commande> findByClientId(Long clientId);

    List<Commande> findByClient(Client client);

    List<Commande> findByStatut(String statut);

    @Query("SELECT c FROM Commande c WHERE c.dateCreation BETWEEN :dateDebut AND :dateFin")
    List<Commande> findCommandesBetweenDates(@Param("dateDebut") LocalDateTime dateDebut,
                                           @Param("dateFin") LocalDateTime dateFin);

}
