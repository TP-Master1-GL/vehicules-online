package com.vehicules.controllers;

import com.vehicules.api.dto.CommandeDTO;
import com.vehicules.api.dto.LigneCommandeDTO;
import com.vehicules.api.mappers.CommandeMapper;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.enums.StatutCommande;
import com.vehicules.services.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
@Tag(name = "Commandes", description = "API pour la gestion des commandes")
public class CommandeController {

    private final CommandeService commandeService;
    private final CommandeMapper commandeMapper;

    @PostMapping
    @Operation(
        summary = "Créer une nouvelle commande",
        description = "Crée une commande en utilisant le pattern Factory Method"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Commande créée avec succès",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "400", description = "Requête invalide"),
        @ApiResponse(responseCode = "404", description = "Client ou véhicule non trouvé")
    })
    public ResponseEntity<CommandeDTO> creerCommande(@RequestBody CreerCommandeRequest request) {
        try {
            // Valider les données
            if (request.getClientId() == null || request.getTypePaiement() == null) {
                return ResponseEntity.badRequest().build();
            }

            Commande commande;
            
            if (request.getLignes() != null && !request.getLignes().isEmpty()) {
                // Mode avancé avec lignes spécifiques
                List<CommandeService.LigneCommandeRequest> lignesRequests = request.getLignes().stream()
                        .map(ligneReq -> new CommandeService.LigneCommandeRequest(
                            ligneReq.getVehiculeId(),
                            ligneReq.getQuantite(),
                            ligneReq.getOptionIds()
                        ))
                        .collect(Collectors.toList());
                
                commande = commandeService.creerCommande(
                    request.getClientId(),
                    request.getTypePaiement(),
                    new ArrayList<>(),
                    lignesRequests,
                    request.getPaysLivraison()
                );
            } else if (request.getVehiculeIds() != null && request.getVehiculeIds().length > 0) {
                // Mode simple (legacy)
                commande = commandeService.creerCommande(
                    request.getClientId(),
                    request.getTypePaiement(),
                    Arrays.asList(request.getVehiculeIds()),
                    request.getPaysLivraison()
                );
            } else {
                return ResponseEntity.badRequest().build();
            }
            
            // Convertir en DTO
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            
            return ResponseEntity.status(201).body(commandeDTO);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{commandeId}/lignes")
    @Operation(summary = "Ajouter une ligne à une commande existante")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ligne ajoutée",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "400", description = "Requête invalide"),
        @ApiResponse(responseCode = "404", description = "Commande ou véhicule non trouvé"),
        @ApiResponse(responseCode = "409", description = "Commande non modifiable")
    })
    public ResponseEntity<CommandeDTO> ajouterLigneCommande(
            @PathVariable Long commandeId,
            @RequestBody AjouterLigneRequest request) {
        
        try {
            Commande commande = commandeService.ajouterLigneCommande(
                commandeId,
                request.getVehiculeId(),
                request.getQuantite(),
                request.getOptionIds()
            );
            
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            return ResponseEntity.ok(commandeDTO);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{commandeId}/lignes/{ligneId}")
    @Operation(summary = "Retirer une ligne d'une commande")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ligne retirée",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "400", description = "Requête invalide"),
        @ApiResponse(responseCode = "404", description = "Commande ou ligne non trouvée"),
        @ApiResponse(responseCode = "409", description = "Commande non modifiable")
    })
    public ResponseEntity<CommandeDTO> retirerLigneCommande(
            @PathVariable Long commandeId,
            @PathVariable Long ligneId) {
        
        try {
            Commande commande = commandeService.retirerLigneCommande(commandeId, ligneId);
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            return ResponseEntity.ok(commandeDTO);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une commande par son ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commande trouvée",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> getCommandeById(@PathVariable Long id) {
        try {
            Commande commande = commandeService.getCommandeById(id);
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            return ResponseEntity.ok(commandeDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Obtenir les commandes d'un client")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des commandes du client"),
        @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<List<CommandeDTO>> getCommandesByClient(@PathVariable Long clientId) {
        try {
            List<Commande> commandes = commandeService.getCommandesByClient(clientId);
            List<CommandeDTO> commandeDTOs = commandes.stream()
                    .map(commandeMapper::toDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(commandeDTOs);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/statut/{statut}")
    @Operation(summary = "Obtenir les commandes par statut")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des commandes avec ce statut"),
        @ApiResponse(responseCode = "400", description = "Statut invalide")
    })
    public ResponseEntity<List<CommandeDTO>> getCommandesByStatut(@PathVariable String statut) {
        try {
            StatutCommande.valueOf(statut.toUpperCase());
            
            List<Commande> commandes = commandeService.getCommandesByStatut(statut);
            List<CommandeDTO> commandeDTOs = commandes.stream()
                    .map(commandeMapper::toDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(commandeDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/statut")
    @Operation(summary = "Mettre à jour le statut d'une commande")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statut mis à jour",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "400", description = "Statut invalide"),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> updateStatutCommande(
            @PathVariable Long id,
            @RequestBody UpdateStatutRequest request) {
        
        try {
            StatutCommande statut = StatutCommande.valueOf(request.getStatut().toUpperCase());
            
            Commande commande = commandeService.updateStatutCommande(id, statut);
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            
            return ResponseEntity.ok(commandeDTO);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/valider")
    @Operation(summary = "Valider une commande")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commande validée",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> validerCommande(@PathVariable Long id) {
        try {
            commandeService.validerCommande(id);
            Commande commande = commandeService.getCommandeById(id);
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            return ResponseEntity.ok(commandeDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/payer")
    @Operation(summary = "Payer une commande")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commande payée",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> payerCommande(@PathVariable Long id) {
        try {
            commandeService.payerCommande(id);
            Commande commande = commandeService.getCommandeById(id);
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            return ResponseEntity.ok(commandeDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/livrer")
    @Operation(summary = "Livrer une commande")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commande livrée",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> livrerCommande(@PathVariable Long id) {
        try {
            commandeService.livrerCommande(id);
            Commande commande = commandeService.getCommandeById(id);
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            return ResponseEntity.ok(commandeDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/annuler")
    @Operation(summary = "Annuler une commande")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commande annulée",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> annulerCommande(@PathVariable Long id) {
        try {
            commandeService.annulerCommande(id);
            Commande commande = commandeService.getCommandeById(id);
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            return ResponseEntity.ok(commandeDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/solder-vehicule/{vehiculeId}")
    @Operation(summary = "Appliquer un solde à un véhicule (Pattern Command)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solde appliqué"),
        @ApiResponse(responseCode = "404", description = "Véhicule non trouvé"),
        @ApiResponse(responseCode = "400", description = "Pourcentage invalide")
    })
    public ResponseEntity<String> appliquerSoldeVehicule(
            @PathVariable Long vehiculeId,
            @RequestParam Double pourcentage) {
        
        try {
            if (pourcentage <= 0 || pourcentage > 100) {
                return ResponseEntity.badRequest().body("Pourcentage doit être entre 0 et 100");
            }
            
            commandeService.appliquerSolde(vehiculeId, BigDecimal.valueOf(pourcentage));
            return ResponseEntity.ok("Solde de " + pourcentage + "% appliqué au véhicule");
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/retirer-solde/{vehiculeId}")
    @Operation(summary = "Retirer le solde d'un véhicule")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solde retiré"),
        @ApiResponse(responseCode = "404", description = "Véhicule non trouvé")
    })
    public ResponseEntity<String> retirerSoldeVehicule(@PathVariable Long vehiculeId) {
        try {
            commandeService.retirerSolde(vehiculeId);
            return ResponseEntity.ok("Solde retiré du véhicule");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/periode")
    @Operation(summary = "Obtenir les commandes sur une période")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des commandes de la période"),
        @ApiResponse(responseCode = "400", description = "Dates invalides")
    })
    public ResponseEntity<List<CommandeDTO>> getCommandesByPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        
        try {
            if (dateDebut.isAfter(dateFin)) {
                return ResponseEntity.badRequest().build();
            }
            
            List<Commande> commandes = commandeService.getCommandesBetweenDates(dateDebut, dateFin);
            List<CommandeDTO> commandeDTOs = commandes.stream()
                    .map(commandeMapper::toDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(commandeDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/stats/{clientId}")
    @Operation(summary = "Obtenir les statistiques des commandes d'un client")
    public ResponseEntity<CommandesStatsResponse> getStatsCommandes(@PathVariable Long clientId) {
        try {
            List<Commande> commandes = commandeService.getCommandesByClient(clientId);
            
            long totalCommandes = commandes.size();
            long commandesEnCours = commandes.stream()
                    .filter(c -> StatutCommande.EN_COURS.name().equals(c.getStatut()))
                    .count();
            long commandesValidees = commandes.stream()
                    .filter(c -> StatutCommande.VALIDEE.name().equals(c.getStatut()))
                    .count();
            long commandesPayees = commandes.stream()
                    .filter(c -> StatutCommande.PAYEE.name().equals(c.getStatut()))
                    .count();
            long commandesLivrees = commandes.stream()
                    .filter(c -> StatutCommande.LIVREE.name().equals(c.getStatut()))
                    .count();
            long commandesAnnulees = commandes.stream()
                    .filter(c -> StatutCommande.ANNULEE.name().equals(c.getStatut()))
                    .count();
            
            double montantTotal = commandes.stream()
                    .mapToDouble(c -> c.getMontantTotal() != null ? c.getMontantTotal().doubleValue() : 0.0)
                    .sum();
            
            CommandesStatsResponse stats = new CommandesStatsResponse(
                totalCommandes,
                commandesEnCours,
                commandesValidees,
                commandesPayees,
                commandesLivrees,
                commandesAnnulees,
                montantTotal
            );
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/en-cours")
    @Operation(summary = "Obtenir les commandes en cours")
    public ResponseEntity<List<CommandeDTO>> getCommandesEnCours() {
        List<Commande> commandes = commandeService.getCommandesEnCours();
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }

    @GetMapping("/validees")
    @Operation(summary = "Obtenir les commandes validées")
    public ResponseEntity<List<CommandeDTO>> getCommandesValidees() {
        List<Commande> commandes = commandeService.getCommandesValidees();
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }

    @GetMapping("/payees")
    @Operation(summary = "Obtenir les commandes payées")
    public ResponseEntity<List<CommandeDTO>> getCommandesPayees() {
        List<Commande> commandes = commandeService.getCommandesPayees();
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }

    @GetMapping("/livrees")
    @Operation(summary = "Obtenir les commandes livrées")
    public ResponseEntity<List<CommandeDTO>> getCommandesLivrees() {
        List<Commande> commandes = commandeService.getCommandesLivrees();
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }

    @GetMapping("/annulees")
    @Operation(summary = "Obtenir les commandes annulées")
    public ResponseEntity<List<CommandeDTO>> getCommandesAnnulees() {
        List<Commande> commandes = commandeService.getCommandesAnnulees();
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commandeDTOs);
    }

    // Classes internes pour les requêtes et réponses
    public static class CreerCommandeRequest {
        private Long clientId;
        private String typePaiement;
        private Long[] vehiculeIds;
        private List<LigneRequest> lignes;
        private String paysLivraison;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        
        public String getTypePaiement() { return typePaiement; }
        public void setTypePaiement(String typePaiement) { 
            if (typePaiement != null) {
                this.typePaiement = typePaiement.toUpperCase();
            }
        }
        
        public Long[] getVehiculeIds() { return vehiculeIds; }
        public void setVehiculeIds(Long[] vehiculeIds) { this.vehiculeIds = vehiculeIds; }
        
        public List<LigneRequest> getLignes() { return lignes; }
        public void setLignes(List<LigneRequest> lignes) { this.lignes = lignes; }
        
        public String getPaysLivraison() { return paysLivraison; }
        public void setPaysLivraison(String paysLivraison) { this.paysLivraison = paysLivraison; }
    }

    public static class LigneRequest {
        private Long vehiculeId;
        private Integer quantite;
        private List<Long> optionIds;

        public Long getVehiculeId() { return vehiculeId; }
        public void setVehiculeId(Long vehiculeId) { this.vehiculeId = vehiculeId; }

        public Integer getQuantite() { return quantite; }
        public void setQuantite(Integer quantite) { this.quantite = quantite; }

        public List<Long> getOptionIds() { return optionIds; }
        public void setOptionIds(List<Long> optionIds) { this.optionIds = optionIds; }
    }

    public static class AjouterLigneRequest {
        private Long vehiculeId;
        private Integer quantite;
        private List<Long> optionIds;

        public Long getVehiculeId() { return vehiculeId; }
        public void setVehiculeId(Long vehiculeId) { this.vehiculeId = vehiculeId; }

        public Integer getQuantite() { return quantite; }
        public void setQuantite(Integer quantite) { this.quantite = quantite; }

        public List<Long> getOptionIds() { return optionIds; }
        public void setOptionIds(List<Long> optionIds) { this.optionIds = optionIds; }
    }

    public static class UpdateStatutRequest {
        private String statut;

        public String getStatut() { return statut; }
        public void setStatut(String statut) { 
            if (statut != null) {
                this.statut = statut.toUpperCase();
            }
        }
    }

    public static class CommandesStatsResponse {
        private long totalCommandes;
        private long commandesEnCours;
        private long commandesValidees;
        private long commandesPayees;
        private long commandesLivrees;
        private long commandesAnnulees;
        private double montantTotal;

        public CommandesStatsResponse() {}

        public CommandesStatsResponse(long totalCommandes, long commandesEnCours, 
                                     long commandesValidees, long commandesPayees,
                                     long commandesLivrees, long commandesAnnulees,
                                     double montantTotal) {
            this.totalCommandes = totalCommandes;
            this.commandesEnCours = commandesEnCours;
            this.commandesValidees = commandesValidees;
            this.commandesPayees = commandesPayees;
            this.commandesLivrees = commandesLivrees;
            this.commandesAnnulees = commandesAnnulees;
            this.montantTotal = montantTotal;
        }

        public long getTotalCommandes() { return totalCommandes; }
        public void setTotalCommandes(long totalCommandes) { this.totalCommandes = totalCommandes; }
        
        public long getCommandesEnCours() { return commandesEnCours; }
        public void setCommandesEnCours(long commandesEnCours) { this.commandesEnCours = commandesEnCours; }
        
        public long getCommandesValidees() { return commandesValidees; }
        public void setCommandesValidees(long commandesValidees) { this.commandesValidees = commandesValidees; }
        
        public long getCommandesPayees() { return commandesPayees; }
        public void setCommandesPayees(long commandesPayees) { this.commandesPayees = commandesPayees; }
        
        public long getCommandesLivrees() { return commandesLivrees; }
        public void setCommandesLivrees(long commandesLivrees) { this.commandesLivrees = commandesLivrees; }
        
        public long getCommandesAnnulees() { return commandesAnnulees; }
        public void setCommandesAnnulees(long commandesAnnulees) { this.commandesAnnulees = commandesAnnulees; }
        
        public double getMontantTotal() { return montantTotal; }
        public void setMontantTotal(double montantTotal) { this.montantTotal = montantTotal; }
    }
}