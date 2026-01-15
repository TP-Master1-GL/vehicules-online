package com.vehicules.controllers;

import com.vehicules.api.dto.CommandeDTO;
import com.vehicules.api.dto.LigneCommandeDTO;
import com.vehicules.api.mappers.CommandeMapper;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.LigneCommande;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
        description = "Crée une commande en utilisant le pattern Factory Method et calcule les taxes avec le Template Method"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Commande créée avec succès",
            content = @Content(schema = @Schema(implementation = CommandeDTO.class))),
        @ApiResponse(responseCode = "400", description = "Requête invalide"),
        @ApiResponse(responseCode = "404", description = "Client ou véhicule non trouvé")
    })
    public ResponseEntity<CommandeDTO> creerCommande(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Données pour créer une commande",
                required = true,
                content = @Content(schema = @Schema(implementation = CreerCommandeRequest.class))
            )
            @RequestBody CreerCommandeRequest request) {
        
        try {
            // Créer la commande avec Service (qui utilise Factory Method et Template Method)
            Commande commande = commandeService.creerCommande(
                request.getClientId(),
                request.getTypePaiement(),
                Arrays.asList(request.getVehiculeIds()),
                request.getPaysLivraison()
            );
            
            // Convertir en DTO
            CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
            
            return ResponseEntity.ok(commandeDTO);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
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
    public ResponseEntity<CommandeDTO> getCommandeById(
            @Parameter(description = "ID de la commande", required = true)
            @PathVariable Long id) {
        
        Commande commande = commandeService.getCommandeById(id);
        if (commande == null) {
            return ResponseEntity.notFound().build();
        }
        
        CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
        return ResponseEntity.ok(commandeDTO);
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Obtenir les commandes d'un client")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des commandes du client"),
        @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<List<CommandeDTO>> getCommandesByClient(
            @Parameter(description = "ID du client", required = true)
            @PathVariable Long clientId) {
        
        List<Commande> commandes = commandeService.getCommandesByClient(clientId);
        List<CommandeDTO> commandeDTOs = commandes.stream()
                .map(commandeMapper::toDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(commandeDTOs);
    }

    @PutMapping("/{id}/statut")
    @Operation(summary = "Mettre à jour le statut d'une commande")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statut mis à jour"),
        @ApiResponse(responseCode = "400", description = "Statut invalide"),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> updateStatutCommande(
            @Parameter(description = "ID de la commande", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Nouveau statut de la commande",
                required = true,
                content = @Content(schema = @Schema(implementation = UpdateStatutRequest.class))
            )
            @RequestBody UpdateStatutRequest request) {
        
        try {
            // Valider le statut
            StatutCommande statut = StatutCommande.valueOf(request.getStatut().toUpperCase());
            
            // Mettre à jour le statut
            Commande commande = commandeService.updateStatutCommande(id, statut);
            
            // Convertir en DTO
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
        @ApiResponse(responseCode = "200", description = "Commande validée"),
        @ApiResponse(responseCode = "404", description = "Commande non trouvée")
    })
    public ResponseEntity<CommandeDTO> validerCommande(
            @Parameter(description = "ID de la commande", required = true)
            @PathVariable Long id) {
        
        commandeService.validerCommande(id);
        Commande commande = commandeService.getCommandeById(id);
        CommandeDTO commandeDTO = commandeMapper.toDTO(commande);
        
        return ResponseEntity.ok(commandeDTO);
    }

    @PostMapping("/solder-vehicule/{vehiculeId}")
    @Operation(summary = "Appliquer un solde à un véhicule (Pattern Command)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solde appliqué"),
        @ApiResponse(responseCode = "404", description = "Véhicule non trouvé")
    })
    public ResponseEntity<String> appliquerSoldeVehicule(
            @Parameter(description = "ID du véhicule", required = true)
            @PathVariable Long vehiculeId,
            @RequestParam Double pourcentage) {
        
        commandeService.appliquerSolde(vehiculeId, new java.math.BigDecimal(pourcentage));
        return ResponseEntity.ok("Solde de " + pourcentage + "% appliqué au véhicule");
    }

    @GetMapping("/stats/{clientId}")
    @Operation(summary = "Obtenir les statistiques des commandes d'un client")
    public ResponseEntity<CommandesStatsResponse> getStatsCommandes(
            @PathVariable Long clientId) {
        
        List<Commande> commandes = commandeService.getCommandesByClient(clientId);
        
        long totalCommandes = commandes.size();
        long commandesEnCours = commandes.stream()
                .filter(c -> StatutCommande.EN_COURS.name().equals(c.getStatut()))
                .count();
        long commandesValidees = commandes.stream()
                .filter(c -> StatutCommande.VALIDEE.name().equals(c.getStatut()))
                .count();
        
        double montantTotal = commandes.stream()
                .mapToDouble(c -> c.getMontantTotal() != null ? c.getMontantTotal().doubleValue() : 0.0)
                .sum();
        
        CommandesStatsResponse stats = new CommandesStatsResponse(
            totalCommandes,
            commandesEnCours,
            commandesValidees,
            montantTotal
        );
        
        return ResponseEntity.ok(stats);
    }

    // Classes internes pour les requêtes et réponses
    public static class CreerCommandeRequest {
        @Schema(description = "ID du client", example = "1")
        private Long clientId;
        
        @Schema(description = "Type de paiement (COMPTANT ou CREDIT)", example = "COMPTANT")
        private String typePaiement;
        
        @Schema(description = "IDs des véhicules à commander", example = "[1, 2, 3]")
        private Long[] vehiculeIds;
        
        @Schema(description = "Pays de livraison (FR, BE, LU)", example = "FR")
        private String paysLivraison;

        // Getters et setters
        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        
        public String getTypePaiement() { return typePaiement; }
        public void setTypePaiement(String typePaiement) { this.typePaiement = typePaiement; }
        
        public Long[] getVehiculeIds() { return vehiculeIds; }
        public void setVehiculeIds(Long[] vehiculeIds) { this.vehiculeIds = vehiculeIds; }
        
        public String getPaysLivraison() { return paysLivraison; }
        public void setPaysLivraison(String paysLivraison) { this.paysLivraison = paysLivraison; }
    }

    public static class UpdateStatutRequest {
        @Schema(description = "Nouveau statut de la commande", 
                example = "VALIDEE")
        private String statut;

        public String getStatut() { return statut; }
        public void setStatut(String statut) { this.statut = statut; }
    }

    public static class CommandesStatsResponse {
        @Schema(description = "Nombre total de commandes")
        private long totalCommandes;
        
        @Schema(description = "Nombre de commandes en cours")
        private long commandesEnCours;
        
        @Schema(description = "Nombre de commandes validées")
        private long commandesValidees;
        
        @Schema(description = "Montant total des commandes")
        private double montantTotal;

        public CommandesStatsResponse(long totalCommandes, long commandesEnCours, 
                                     long commandesValidees, double montantTotal) {
            this.totalCommandes = totalCommandes;
            this.commandesEnCours = commandesEnCours;
            this.commandesValidees = commandesValidees;
            this.montantTotal = montantTotal;
        }

        // Getters
        public long getTotalCommandes() { return totalCommandes; }
        public long getCommandesEnCours() { return commandesEnCours; }
        public long getCommandesValidees() { return commandesValidees; }
        public double getMontantTotal() { return montantTotal; }
    }
}