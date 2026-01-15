package com.vehicules.services;

import com.vehicules.core.entities.*;
import com.vehicules.repositories.OptionVehiculeRepository;
import com.vehicules.repositories.PanierRepository;
import com.vehicules.repositories.VehiculeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PanierService {

    private final PanierRepository panierRepository;
    private final VehiculeRepository vehiculeRepository;
    private final OptionVehiculeRepository optionVehiculeRepository;

    @Transactional
    public Panier getOrCreatePanierForClient(Client client) {
        return panierRepository.findByClient(client)
                .orElseGet(() -> {
                    Panier nouveauPanier = new Panier();
                    nouveauPanier.setClient(client);
                    return panierRepository.save(nouveauPanier);
                });
    }

    @Transactional
    public Panier ajouterAuPanier(Long clientId, Long vehiculeId, List<Long> optionsIds) {
        // Trouver ou créer le panier du client
        Client client = new ClientParticulier(); // À récupérer depuis le contexte de sécurité
        client.setId(clientId);

        Panier panier = getOrCreatePanierForClient(client);

        // Vérifier si le véhicule existe
        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        // Créer la ligne de panier
        LignePanier ligne = new LignePanier();
        ligne.setVehicule(vehicule);
        ligne.setPrixUnitaire(vehicule.getPrixBase());
        ligne.setQuantite(1);

        // Ajouter les options si elles sont spécifiées
        if (optionsIds != null && !optionsIds.isEmpty()) {
            for (Long optionId : optionsIds) {
                OptionVehicule option = optionVehiculeRepository.findById(optionId)
                        .orElseThrow(() -> new RuntimeException("Option non trouvée: " + optionId));
                ligne.ajouterOption(option);
            }
        }

        panier.ajouterLigne(ligne);
        return panierRepository.save(panier);
    }

    @Transactional
    public Panier retirerDuPanier(Long clientId, Long lignePanierId) {
        Client client = new ClientParticulier();
        client.setId(clientId);

        Panier panier = panierRepository.findByClient(client)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé"));

        LignePanier ligneASupprimer = panier.getLignes().stream()
                .filter(ligne -> ligne.getId().equals(lignePanierId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ligne de panier non trouvée"));

        panier.retirerLigne(ligneASupprimer);
        return panierRepository.save(panier);
    }

    @Transactional(readOnly = true)
    public Optional<Panier> getPanierByClientId(Long clientId) {
        Client client = new ClientParticulier();
        client.setId(clientId);
        return panierRepository.findByClient(client);
    }

    @Transactional
    public Panier modifierQuantite(Long clientId, Long lignePanierId, int nouvelleQuantite) {
        if (nouvelleQuantite <= 0) {
            throw new IllegalArgumentException("La quantité doit être supérieure à 0");
        }

        Client client = new ClientParticulier();
        client.setId(clientId);

        Panier panier = panierRepository.findByClient(client)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé"));

        LignePanier ligne = panier.getLignes().stream()
                .filter(l -> l.getId().equals(lignePanierId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ligne de panier non trouvée"));

        ligne.setQuantite(nouvelleQuantite);
        return panierRepository.save(panier);
    }

    @Transactional
    public void viderPanier(Long clientId) {
        Client client = new ClientParticulier();
        client.setId(clientId);
        panierRepository.deleteByClient(client);
    }

    @Transactional
    public Panier ajouterOption(Long clientId, Long lignePanierId, Long optionId) {
        Client client = new ClientParticulier();
        client.setId(clientId);

        Panier panier = panierRepository.findByClient(client)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé"));

        LignePanier ligne = panier.getLignes().stream()
                .filter(l -> l.getId().equals(lignePanierId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ligne de panier non trouvée"));

        OptionVehicule option = optionVehiculeRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option non trouvée"));

        ligne.ajouterOption(option);
        return panierRepository.save(panier);
    }

    @Transactional
    public Panier retirerOption(Long clientId, Long lignePanierId, Long optionId) {
        Client client = new ClientParticulier();
        client.setId(clientId);

        Panier panier = panierRepository.findByClient(client)
                .orElseThrow(() -> new RuntimeException("Panier non trouvé"));

        LignePanier ligne = panier.getLignes().stream()
                .filter(l -> l.getId().equals(lignePanierId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ligne de panier non trouvée"));

        OptionVehicule option = optionVehiculeRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option non trouvée"));

        ligne.retirerOption(option);
        return panierRepository.save(panier);
    }
}
