package com.vehicules.services;

import com.vehicules.core.entities.*;
import com.vehicules.core.enums.StatutCommande;
import com.vehicules.patterns.factory.*;
import com.vehicules.patterns.template.*;
import com.vehicules.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final VehiculeRepository vehiculeRepository;
    private final CalculCommandeFactory calculCommandeFactory;

    public Commande creerCommande(Long clientId, String typePaiement, 
                                 List<Long> vehiculeIds, String paysLivraison) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        List<Vehicule> vehicules = vehiculeRepository.findAllById(vehiculeIds);
        if (vehicules.isEmpty()) {
            throw new RuntimeException("Aucun véhicule sélectionné");
        }

        // Créer la commande avec Factory Method
        Commande commande = creerCommandeAvecFactory(typePaiement, client);
        commande.setDateCreation(LocalDateTime.now());
        commande.setStatut(StatutCommande.EN_COURS.name());
        commande.setPaysLivraison(paysLivraison);

        // Créer les lignes de commande
        List<LigneCommande> lignes = new ArrayList<>();
        for (Vehicule vehicule : vehicules) {
            LigneCommande ligne = new LigneCommande();
            ligne.setVehicule(vehicule);
            ligne.setPrixUnitaire(vehicule.getPrixFinal());
            ligne.setQuantite(1);
            ligne.setCommande(commande);
            
            // Calculer le prix total
            BigDecimal prixLigne = ligne.getPrixUnitaire()
                .multiply(BigDecimal.valueOf(ligne.getQuantite()));
            ligne.setPrixTotal(prixLigne);
            
            lignes.add(ligne);
        }
        
        commande.setLignes(lignes);

        // Calculer le montant avec Template Method
        BigDecimal montantTotal = calculerMontantCommande(commande);
        commande.setMontantTotal(montantTotal);

        return commandeRepository.save(commande);
    }

    private Commande creerCommandeAvecFactory(String typePaiement, Client client) {
        if ("COMPTANT".equalsIgnoreCase(typePaiement)) {
            CommandeComptantFactory factory = new CommandeComptantFactory();
            CommandeComptant commande = (CommandeComptant) factory.creerCommande(client);
            commande.setModePaiement("CARTE_BANCAIRE");
            return commande;

        } else if ("CREDIT".equalsIgnoreCase(typePaiement)) {
            CommandeCreditFactory factory = new CommandeCreditFactory(0.05, 12);
            CommandeCredit commande = (CommandeCredit) factory.creerCommande(client);
            commande.setDureeMois(12);
            commande.setTauxInteret(new BigDecimal("5.00"));
            commande.setOrganismeCredit("Banque Standard");
            return commande;
            
        } else {
            throw new IllegalArgumentException("Type de paiement invalide: " + typePaiement);
        }
    }

    private BigDecimal calculerMontantCommande(Commande commande) {
        try {
            // Utiliser le Template Method
            CalculCommandeTemplate calculateur = calculCommandeFactory.getCalculateur(commande);
            double montantDouble = calculateur.calculeTotal(commande);
            return BigDecimal.valueOf(montantDouble);
        } catch (Exception e) {
            // En cas d'erreur, calculer un montant de base
            return commande.getLignes().stream()
                    .map(LigneCommande::getPrixTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
    }

    public Commande getCommandeById(Long id) {
        return commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
    }

    public List<Commande> getCommandesByClient(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        return commandeRepository.findByClient(client);
    }

    public Commande updateStatutCommande(Long commandeId, StatutCommande statut) {
        Commande commande = getCommandeById(commandeId);
        commande.setStatut(statut.name());
        return commandeRepository.save(commande);
    }

    public void validerCommande(Long commandeId) {
        updateStatutCommande(commandeId, StatutCommande.VALIDEE);
    }

    public void appliquerSolde(Long vehiculeId, BigDecimal pourcentage) {
        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        vehicule.setEnSolde(true);
        vehicule.setPourcentageSolde(pourcentage);
        vehiculeRepository.save(vehicule);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public List<Commande> getCommandesByStatut(String statut) {
        return commandeRepository.findByStatut(statut);
    }
}