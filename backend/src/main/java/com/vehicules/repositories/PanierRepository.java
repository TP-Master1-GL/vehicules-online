package com.vehicules.repositories;

import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PanierRepository extends JpaRepository<Panier, Long> {

    Optional<Panier> findByClient(Client client);

    Optional<Panier> findByClientId(Long clientId);

    void deleteByClient(Client client);
}
