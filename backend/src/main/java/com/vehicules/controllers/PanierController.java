package com.vehicules.controllers;

import com.vehicules.api.dto.PanierDTO;
import com.vehicules.api.mappers.PanierMapper;
import com.vehicules.core.entities.Panier;
import com.vehicules.services.PanierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/panier")
@RequiredArgsConstructor
@Tag(name = "Panier", description = "API pour la gestion du panier d'achat")
public class PanierController {

    private final PanierService panierService;
    private final PanierMapper panierMapper;

    @PostMapping("/ajouter")
    @Operation(summary = "Ajouter un véhicule au panier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Véhicule ajouté au panier",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "400", description = "Requête invalide"),
        @ApiResponse(responseCode = "404", description = "Véhicule ou option non trouvé")
    })
    public ResponseEntity<PanierDTO> ajouterAuPanier(@RequestBody AjouterPanierRequest request) {
        try {
            Panier panier = panierService.ajouterAuPanier(
                request.getClientId(),
                request.getVehiculeId(),
                request.getOptionsIds() != null ? List.of(request.getOptionsIds()) : List.of()
            );
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            return ResponseEntity.ok(panierDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/retirer/{lignePanierId}")
    @Operation(summary = "Retirer une ligne du panier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ligne retirée du panier"),
        @ApiResponse(responseCode = "404", description = "Panier ou ligne non trouvée")
    })
    public ResponseEntity<PanierDTO> retirerDuPanier(
            @Parameter(description = "ID de la ligne de panier", required = true)
            @PathVariable Long lignePanierId,
            @RequestParam Long clientId) {
        try {
            Panier panier = panierService.retirerDuPanier(clientId, lignePanierId);
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            return ResponseEntity.ok(panierDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @Operation(summary = "Obtenir le panier du client connecté")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Panier trouvé",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "404", description = "Panier non trouvé")
    })
    public ResponseEntity<PanierDTO> getPanier() {
        // TODO: Récupérer le client depuis le contexte de sécurité JWT
        // Pour l'instant, retourner un panier vide
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{clientId}")
    @Operation(summary = "Obtenir le panier d'un client")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Panier trouvé",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "404", description = "Panier non trouvé")
    })
    public ResponseEntity<PanierDTO> getPanier(
            @Parameter(description = "ID du client", required = true)
            @PathVariable Long clientId) {
        Optional<Panier> panierOpt = panierService.getPanierByClientId(clientId);
        if (panierOpt.isPresent()) {
            PanierDTO panierDTO = panierMapper.toDTO(panierOpt.get());
            return ResponseEntity.ok(panierDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/modifier-quantite")
    @Operation(summary = "Modifier la quantité d'une ligne de panier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Quantité modifiée",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "400", description = "Quantité invalide"),
        @ApiResponse(responseCode = "404", description = "Panier ou ligne non trouvée")
    })
    public ResponseEntity<PanierDTO> modifierQuantite(@RequestBody ModifierQuantiteRequest request) {
        try {
            Panier panier = panierService.modifierQuantite(
                request.getClientId(),
                request.getLignePanierId(),
                request.getNouvelleQuantite()
            );
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            return ResponseEntity.ok(panierDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/vider/{clientId}")
    @Operation(summary = "Vider complètement le panier d'un client")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Panier vidé"),
        @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<String> viderPanier(
            @Parameter(description = "ID du client", required = true)
            @PathVariable Long clientId) {
        try {
            panierService.viderPanier(clientId);
            return ResponseEntity.ok("Panier vidé");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/ajouter-option")
    @Operation(summary = "Ajouter une option à une ligne de panier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Option ajoutée",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "404", description = "Panier, ligne ou option non trouvée")
    })
    public ResponseEntity<PanierDTO> ajouterOption(@RequestBody AjouterOptionRequest request) {
        try {
            Panier panier = panierService.ajouterOption(
                request.getClientId(),
                request.getLignePanierId(),
                request.getOptionId()
            );
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            return ResponseEntity.ok(panierDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/retirer-option")
    @Operation(summary = "Retirer une option d'une ligne de panier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Option retirée",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "404", description = "Panier, ligne ou option non trouvée")
    })
    public ResponseEntity<PanierDTO> retirerOption(@RequestBody RetirerOptionRequest request) {
        try {
            Panier panier = panierService.retirerOption(
                request.getClientId(),
                request.getLignePanierId(),
                request.getOptionId()
            );
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            return ResponseEntity.ok(panierDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Classes internes pour les requêtes
    public static class AjouterPanierRequest {
        @Schema(description = "ID du client", example = "1")
        private Long clientId;

        @Schema(description = "ID du véhicule", example = "1")
        private Long vehiculeId;

        @Schema(description = "IDs des options (optionnel)", example = "[1, 2]")
        private Long[] optionsIds;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }

        public Long getVehiculeId() { return vehiculeId; }
        public void setVehiculeId(Long vehiculeId) { this.vehiculeId = vehiculeId; }

        public Long[] getOptionsIds() { return optionsIds; }
        public void setOptionsIds(Long[] optionsIds) { this.optionsIds = optionsIds; }
    }

    public static class ModifierQuantiteRequest {
        @Schema(description = "ID du client", example = "1")
        private Long clientId;

        @Schema(description = "ID de la ligne de panier", example = "1")
        private Long lignePanierId;

        @Schema(description = "Nouvelle quantité", example = "2")
        private int nouvelleQuantite;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }

        public Long getLignePanierId() { return lignePanierId; }
        public void setLignePanierId(Long lignePanierId) { this.lignePanierId = lignePanierId; }

        public int getNouvelleQuantite() { return nouvelleQuantite; }
        public void setNouvelleQuantite(int nouvelleQuantite) { this.nouvelleQuantite = nouvelleQuantite; }
    }

    public static class AjouterOptionRequest {
        @Schema(description = "ID du client", example = "1")
        private Long clientId;

        @Schema(description = "ID de la ligne de panier", example = "1")
        private Long lignePanierId;

        @Schema(description = "ID de l'option", example = "1")
        private Long optionId;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }

        public Long getLignePanierId() { return lignePanierId; }
        public void setLignePanierId(Long lignePanierId) { this.lignePanierId = lignePanierId; }

        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
    }

    public static class RetirerOptionRequest {
        @Schema(description = "ID du client", example = "1")
        private Long clientId;

        @Schema(description = "ID de la ligne de panier", example = "1")
        private Long lignePanierId;

        @Schema(description = "ID de l'option", example = "1")
        private Long optionId;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }

        public Long getLignePanierId() { return lignePanierId; }
        public void setLignePanierId(Long lignePanierId) { this.lignePanierId = lignePanierId; }

        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
    }
}
