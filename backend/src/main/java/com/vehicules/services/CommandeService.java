package com.vehicules.services;

import com.vehicules.core.entities.*;
import com.vehicules.core.enums.StatutCommande;
import com.vehicules.repositories.*;
import com.vehicules.patterns.factory.CommandeComptantFactory;
import com.vehicules.patterns.factory.CommandeCreditFactory;
import com.vehicules.patterns.factory.CommandeFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final VehiculeRepository vehiculeRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final OptionVehiculeRepository optionVehiculeRepository;

    @Transactional
    public Commande creerCommande(Long clientId, String typePaiement, List<Long> vehiculeIds, String paysLivraison) {
        return creerCommande(clientId, typePaiement, vehiculeIds, new ArrayList<>(), paysLivraison);
    }

    @Transactional
    public Commande creerCommande(Long clientId, String typePaiement, List<Long> vehiculeIds, 
                                 List<LigneCommandeRequest> lignesRequests, String paysLivraison) {
        // 1. Vérifier le client
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client non trouvé avec l'ID: " + clientId));

        // 2. Créer la commande avec le pattern Factory
        Commande commande;
        CommandeFactory factory;

        if ("CREDIT".equalsIgnoreCase(typePaiement)) {
            // Paramètres pour le crédit (taux d'intérêt et durée)
            double tauxInteret = 3.5; // Taux par défaut
            int dureeMois = 48; // Durée par défaut
            factory = new CommandeCreditFactory(tauxInteret, dureeMois);
        } else if ("COMPTANT".equalsIgnoreCase(typePaiement)) {
            // Paiement comptant
            factory = new CommandeComptantFactory();
        } else {
            throw new IllegalArgumentException("Type de paiement non valide: " + typePaiement + 
                                               ". Valeurs acceptées: COMPTANT, CREDIT");
        }

        commande = factory.creerCommande(client);

        // 3. Initialiser les propriétés de base
        commande.setDateCreation(LocalDateTime.now());
        commande.setStatut(StatutCommande.EN_COURS.name());
        commande.setPaysLivraison(paysLivraison);

        // 4. Sauvegarder d'abord la commande pour avoir un ID
        commande = commandeRepository.save(commande);

        // 5. Créer les lignes de commande avec ou sans options
        BigDecimal montantTotal = BigDecimal.ZERO;
        List<LigneCommande> lignesCommande = new ArrayList<>();
        
        if (lignesRequests != null && !lignesRequests.isEmpty()) {
            // Utiliser les lignes avec options spécifiées
            for (LigneCommandeRequest ligneRequest : lignesRequests) {
                Vehicule vehicule = vehiculeRepository.findById(ligneRequest.getVehiculeId())
                        .orElseThrow(() -> new IllegalArgumentException("Véhicule non trouvé: " + ligneRequest.getVehiculeId()));
                
                LigneCommande ligne = creerLigneCommande(commande, vehicule, ligneRequest);
                lignesCommande.add(ligne);
                montantTotal = montantTotal.add(ligne.getPrixTotal());
            }
        } else {
            // Créer des lignes simples sans options (mode legacy)
            for (Long vehiculeId : vehiculeIds) {
                Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                        .orElseThrow(() -> new IllegalArgumentException("Véhicule non trouvé: " + vehiculeId));
                
                LigneCommande ligne = new LigneCommande();
                ligne.setCommande(commande);
                ligne.setVehicule(vehicule);
                ligne.setQuantite(1);
                ligne.setPrixUnitaire(vehicule.getPrix());
                
                // Déclencher le calcul du prix total
                ligne.calculerPrixTotal();
                
                ligneCommandeRepository.save(ligne);
                lignesCommande.add(ligne);
                
                montantTotal = montantTotal.add(ligne.getPrixTotal());
            }
        }

        // 6. Mettre à jour le montant total et les lignes
        commande.setMontantTotal(montantTotal);
        commande.setLignes(lignesCommande);

        // 7. Sauvegarder la commande avec le montant total
        return commandeRepository.save(commande);
    }

    private LigneCommande creerLigneCommande(Commande commande, Vehicule vehicule, LigneCommandeRequest ligneRequest) {
        LigneCommande ligne = new LigneCommande();
        ligne.setCommande(commande);
        ligne.setVehicule(vehicule);
        ligne.setQuantite(ligneRequest.getQuantite() != null ? ligneRequest.getQuantite() : 1);
        ligne.setPrixUnitaire(vehicule.getPrix());
        
        // Ajouter les options si spécifiées
        if (ligneRequest.getOptionIds() != null && !ligneRequest.getOptionIds().isEmpty()) {
            List<OptionVehicule> options = optionVehiculeRepository.findAllById(ligneRequest.getOptionIds());
            if (options.size() != ligneRequest.getOptionIds().size()) {
                throw new IllegalArgumentException("Certaines options n'ont pas été trouvées");
            }
            ligne.setOptions(options);
        }
        
        // Déclencher le calcul du prix total
        ligne.calculerPrixTotal();
        
        return ligneCommandeRepository.save(ligne);
    }

    @Transactional
    public Commande ajouterLigneCommande(Long commandeId, Long vehiculeId, Integer quantite, List<Long> optionIds) {
        Commande commande = getCommandeById(commandeId);
        
        // Vérifier que la commande n'est pas déjà validée/annulée
        if (!StatutCommande.EN_COURS.name().equals(commande.getStatut())) {
            throw new IllegalStateException("Impossible d'ajouter une ligne à une commande " + commande.getStatut());
        }
        
        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new IllegalArgumentException("Véhicule non trouvé: " + vehiculeId));
        
        LigneCommandeRequest ligneRequest = new LigneCommandeRequest();
        ligneRequest.setVehiculeId(vehiculeId);
        ligneRequest.setQuantite(quantite);
        ligneRequest.setOptionIds(optionIds);
        
        LigneCommande ligne = creerLigneCommande(commande, vehicule, ligneRequest);
        
        // Mettre à jour le montant total
        BigDecimal nouveauMontant = commande.getMontantTotal().add(ligne.getPrixTotal());
        commande.setMontantTotal(nouveauMontant);
        commande.getLignes().add(ligne);
        
        return commandeRepository.save(commande);
    }

    @Transactional
    public Commande retirerLigneCommande(Long commandeId, Long ligneId) {
        Commande commande = getCommandeById(commandeId);
        
        // Vérifier que la commande n'est pas déjà validée/annulée
        if (!StatutCommande.EN_COURS.name().equals(commande.getStatut())) {
            throw new IllegalStateException("Impossible de retirer une ligne d'une commande " + commande.getStatut());
        }
        
        LigneCommande ligne = ligneCommandeRepository.findById(ligneId)
                .orElseThrow(() -> new IllegalArgumentException("Ligne de commande non trouvée: " + ligneId));
        
        // Vérifier que la ligne appartient à cette commande
        if (!ligne.getCommande().getId().equals(commandeId)) {
            throw new IllegalArgumentException("Cette ligne n'appartient pas à la commande spécifiée");
        }
        
        // Mettre à jour le montant total
        BigDecimal nouveauMontant = commande.getMontantTotal().subtract(ligne.getPrixTotal());
        commande.setMontantTotal(nouveauMontant);
        
        // Retirer la ligne
        commande.getLignes().remove(ligne);
        ligneCommandeRepository.delete(ligne);
        
        return commandeRepository.save(commande);
    }

    @Transactional
    public LigneCommande ajouterOptionLigne(Long ligneId, Long optionId) {
        LigneCommande ligne = ligneCommandeRepository.findById(ligneId)
                .orElseThrow(() -> new IllegalArgumentException("Ligne de commande non trouvée: " + ligneId));
        
        OptionVehicule option = optionVehiculeRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("Option non trouvée: " + optionId));
        
        // Vérifier que la ligne n'a pas déjà cette option
        if (ligne.getOptions().contains(option)) {
            throw new IllegalArgumentException("Cette option est déjà ajoutée à la ligne");
        }
        
        // Ajouter l'option
        ligne.getOptions().add(option);
        ligne.calculerPrixTotal(); // Recalculer le prix total
        
        // Mettre à jour le montant total de la commande
        Commande commande = ligne.getCommande();
        BigDecimal nouveauMontant = commande.getMontantTotal().add(option.getPrix());
        commande.setMontantTotal(nouveauMontant);
        
        ligneCommandeRepository.save(ligne);
        commandeRepository.save(commande);
        
        return ligne;
    }

    @Transactional
    public LigneCommande retirerOptionLigne(Long ligneId, Long optionId) {
        LigneCommande ligne = ligneCommandeRepository.findById(ligneId)
                .orElseThrow(() -> new IllegalArgumentException("Ligne de commande non trouvée: " + ligneId));
        
        OptionVehicule option = optionVehiculeRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("Option non trouvée: " + optionId));
        
        // Vérifier que la ligne a cette option
        if (!ligne.getOptions().contains(option)) {
            throw new IllegalArgumentException("Cette option n'est pas présente dans la ligne");
        }
        
        // Retirer l'option
        ligne.getOptions().remove(option);
        ligne.calculerPrixTotal(); // Recalculer le prix total
        
        // Mettre à jour le montant total de la commande
        Commande commande = ligne.getCommande();
        BigDecimal nouveauMontant = commande.getMontantTotal().subtract(option.getPrix());
        commande.setMontantTotal(nouveauMontant);
        
        ligneCommandeRepository.save(ligne);
        commandeRepository.save(commande);
        
        return ligne;
    }

    @Transactional(readOnly = true)
    public Commande getCommandeById(Long id) {
        return commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesByClient(Long clientId) {
        return commandeRepository.findByClientId(clientId);
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesByStatut(String statut) {
        return commandeRepository.findByStatut(statut);
    }

    @Transactional
    public Commande updateStatutCommande(Long id, StatutCommande statut) {
        Commande commande = getCommandeById(id);
        commande.setStatut(statut.name());
        
        // Mettre à jour la date de validation si le statut est VALIDEE
        if (statut == StatutCommande.VALIDEE) {
            // Si votre Commande n'a pas de dateValidation, cette ligne ne compile pas
            // Si vous avez besoin de cette fonctionnalité, ajoutez le champ dateValidation à Commande
        }
        
        return commandeRepository.save(commande);
    }

    @Transactional
    public void validerCommande(Long id) {
        updateStatutCommande(id, StatutCommande.VALIDEE);
    }

    @Transactional
    public void payerCommande(Long id) {
        updateStatutCommande(id, StatutCommande.PAYEE);
    }

    @Transactional
    public void livrerCommande(Long id) {
        updateStatutCommande(id, StatutCommande.LIVREE);
    }

    @Transactional
    public void annulerCommande(Long id) {
        updateStatutCommande(id, StatutCommande.ANNULEE);
    }

    @Transactional
    public void appliquerSolde(Long vehiculeId, BigDecimal pourcentage) {
        // Implémentation simplifiée du pattern Command
        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvée avec l'ID: " + vehiculeId));
        
        // Valider le pourcentage
        if (pourcentage.compareTo(BigDecimal.ZERO) <= 0 || pourcentage.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("Pourcentage doit être entre 0 et 100");
        }
        
        // Appliquer le solde
        vehicule.setEnSolde(true);
        vehicule.setPourcentageSolde(pourcentage);
        
        vehiculeRepository.save(vehicule);
    }

    @Transactional
    public void retirerSolde(Long vehiculeId) {
        Vehicule vehicule = vehiculeRepository.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvée avec l'ID: " + vehiculeId));
        
        vehicule.setEnSolde(false);
        vehicule.setPourcentageSolde(null);
        
        vehiculeRepository.save(vehicule);
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesBetweenDates(LocalDateTime dateDebut, LocalDateTime dateFin) {
        return commandeRepository.findCommandesBetweenDates(dateDebut, dateFin);
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesByClientType(Class<?> clientType) {
        return commandeRepository.findByClientType(clientType);
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesByClientTypeAndStatut(Class<?> clientType, String statut) {
        return commandeRepository.findByClientTypeAndStatut(clientType, statut);
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesEnCours() {
        return commandeRepository.findByStatut(StatutCommande.EN_COURS.name());
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesValidees() {
        return commandeRepository.findByStatut(StatutCommande.VALIDEE.name());
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesPayees() {
        return commandeRepository.findByStatut(StatutCommande.PAYEE.name());
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesLivrees() {
        return commandeRepository.findByStatut(StatutCommande.LIVREE.name());
    }

    @Transactional(readOnly = true)
    public List<Commande> getCommandesAnnulees() {
        return commandeRepository.findByStatut(StatutCommande.ANNULEE.name());
    }

    // Classe interne pour la requête de ligne de commande
    public static class LigneCommandeRequest {
        private Long vehiculeId;
        private Integer quantite;
        private List<Long> optionIds;

        public LigneCommandeRequest() {}

        public LigneCommandeRequest(Long vehiculeId, Integer quantite, List<Long> optionIds) {
            this.vehiculeId = vehiculeId;
            this.quantite = quantite;
            this.optionIds = optionIds;
        }

        public Long getVehiculeId() { return vehiculeId; }
        public void setVehiculeId(Long vehiculeId) { this.vehiculeId = vehiculeId; }

        public Integer getQuantite() { return quantite; }
        public void setQuantite(Integer quantite) { this.quantite = quantite; }

        public List<Long> getOptionIds() { return optionIds; }
        public void setOptionIds(List<Long> optionIds) { this.optionIds = optionIds; }
    // ========== MÉTHODES POUR LE PATTERN TEMPLATE ==========
    
    /**
     * Méthode pour CalculTemplateController - calcul du sous-total
     */
    public BigDecimal calculerSousTotalTemplate(Commande commande) {
        if (commande.getLignes() == null || commande.getLignes().isEmpty()) {
            return BigDecimal.ZERO;
        }
        return commande.getLignes().stream()
                .map(LigneCommande::getPrixTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Méthode pour CalculTemplateController - calcul de la TVA (20%)
     */
    public BigDecimal calculerTVA(Commande commande) {
        BigDecimal sousTotal = calculerSousTotalTemplate(commande);
        return sousTotal.multiply(new BigDecimal("0.20"));
    }
    
    /**
     * Méthode pour CalculTemplateController - calcul du montant total avec template
     */
    public BigDecimal calculerMontantAvecTemplate(Commande commande) {
        BigDecimal sousTotal = calculerSousTotalTemplate(commande);
        BigDecimal tva = calculerTVA(commande);
        return sousTotal.add(tva);
    }
    
    // ========== FIN DES MÉTHODES TEMPLATE ==========
    }
}