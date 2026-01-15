package com.vehicules.core.repositories;

import com.vehicules.core.entities.Societe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocieteRepository extends JpaRepository<Societe, Long> {

    /**
     * Trouver une société par SIRET
     */
    Optional<Societe> findBySiret(String siret);

    /**
     * Trouver une société par raison sociale
     */
    Optional<Societe> findByRaisonSociale(String raisonSociale);
}
