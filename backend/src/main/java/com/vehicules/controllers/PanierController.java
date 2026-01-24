package com.vehicules.controllers;

import com.vehicules.api.dto.PanierDTO;
import com.vehicules.api.mappers.PanierMapper;
import com.vehicules.core.entities.Panier;
import com.vehicules.repositories.ClientRepository;
import com.vehicules.security.CustomUserDetails;
import com.vehicules.services.PanierService;
import com.vehicules.services.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/panier")
@RequiredArgsConstructor
@Tag(name = "Panier", description = "API pour la gestion du panier d'achat")
public class PanierController {

    private final PanierService panierService;
    private final PanierMapper panierMapper;
    private final JwtService jwtService;
    private final ClientRepository clientRepository;

    /**
     * Récupère l'ID de l'utilisateur connecté depuis le contexte de sécurité
     * Cette méthode est maintenant pleinement implémentée
     */
    private Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication != null && authentication.isAuthenticated()) {
                Object principal = authentication.getPrincipal();
                
                log.debug("🔍 getCurrentUserId() - Type du principal: {}", 
                         principal != null ? principal.getClass().getSimpleName() : "null");
                log.debug("🔍 getCurrentUserId() - Principal: {}", principal);
                
                // Cas 1: C'est notre CustomUserDetails
                if (principal instanceof CustomUserDetails) {
                    Long userId = ((CustomUserDetails) principal).getId();
                    log.info("✅ ID utilisateur trouvé depuis CustomUserDetails: {}", userId);
                    return userId;
                }
                // Cas 2: C'est un User standard de Spring Security
                else if (principal instanceof org.springframework.security.core.userdetails.User) {
                    String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
                    log.info("🔍 Recherche de l'ID pour l'utilisateur Spring: {}", username);
                    
                    if (!"anonymousUser".equals(username)) {
                        Optional<com.vehicules.core.entities.Client> clientOpt = 
                            clientRepository.findByEmail(username);
                        
                        if (clientOpt.isPresent()) {
                            Long userId = clientOpt.get().getId();
                            log.info("✅ ID utilisateur trouvé dans la BD: {}", userId);
                            return userId;
                        } else {
                            log.warn("⚠️ Client non trouvé dans la BD pour l'email: {}", username);
                        }
                    }
                }
                // Cas 3: C'est une String
                else if (principal instanceof String) {
                    String username = (String) principal;
                    log.info("🔍 Recherche de l'ID pour le principal String: {}", username);
                    
                    if (!"anonymousUser".equals(username)) {
                        Optional<com.vehicules.core.entities.Client> clientOpt = 
                            clientRepository.findByEmail(username);
                        
                        if (clientOpt.isPresent()) {
                            Long userId = clientOpt.get().getId();
                            log.info("✅ ID utilisateur trouvé dans la BD: {}", userId);
                            return userId;
                        } else {
                            log.warn("⚠️ Client non trouvé dans la BD pour le principal String: {}", username);
                        }
                    }
                }
                // Cas 4: C'est un autre type
                else if (principal != null && !"anonymousUser".equals(principal.toString())) {
                    log.warn("⚠️ Type de principal non reconnu: {}", principal.getClass().getName());
                    log.warn("⚠️ Valeur du principal: {}", principal);
                }
            } else {
                log.debug("🔐 Utilisateur non authentifié ou contexte de sécurité vide");
            }
            
            return null;
            
        } catch (Exception e) {
            log.error("❌ Erreur lors de la récupération de l'ID utilisateur: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Récupère l'ID utilisateur depuis le token JWT dans la requête
     * Cette méthode est maintenant pleinement implémentée
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                log.debug("🔍 Extraction de l'ID depuis le token JWT");
                
                // Méthode 1: Extraire directement l'ID du token (si stocké)
                Long userId = jwtService.extractUserId(token);
                if (userId != null) {
                    log.info("✅ ID utilisateur extrait directement du token: {}", userId);
                    return userId;
                }
                
                // Méthode 2: Extraire l'email et chercher dans la BD
                String userEmail = jwtService.extractUsername(token);
                if (userEmail != null) {
                    log.info("🔍 Extraction de l'email du token: {}, recherche dans la BD", userEmail);
                    
                    Optional<com.vehicules.core.entities.Client> clientOpt = 
                        clientRepository.findByEmail(userEmail);
                    
                    if (clientOpt.isPresent()) {
                        userId = clientOpt.get().getId();
                        log.info("✅ ID utilisateur trouvé dans la BD: {}", userId);
                        return userId;
                    } else {
                        log.warn("⚠️ Client non trouvé dans la BD pour l'email: {}", userEmail);
                    }
                } else {
                    log.warn("⚠️ Impossible d'extraire l'email du token");
                }
            } else {
                log.debug("📭 Pas d'en-tête Authorization avec Bearer token");
            }
            
            return null;
            
        } catch (Exception e) {
            log.error("❌ Erreur lors de l'extraction de l'ID depuis la requête: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Récupère l'ID utilisateur en combinant les deux méthodes
     */
    private Long getUserId(HttpServletRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            userId = getUserIdFromRequest(request);
        }
        
        if (userId == null) {
            log.warn("⚠️ Impossible de récupérer l'ID utilisateur");
        } else {
            log.debug("✅ ID utilisateur final: {}", userId);
        }
        
        return userId;
    }

    @PostMapping("/ajouter")
    @Operation(summary = "Ajouter un véhicule au panier de l'utilisateur connecté")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Véhicule ajouté au panier",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "400", description = "Requête invalide"),
        @ApiResponse(responseCode = "401", description = "Non authentifié")
    })
    public ResponseEntity<PanierDTO> ajouterAuPanier(@RequestBody AjouterPanierRequest request, 
                                                     HttpServletRequest httpRequest) {
        try {
            log.info("🛒 Début ajout au panier - Véhicule ID: {}", request.getVehiculeId());
            
            // Récupérer l'ID utilisateur
            Long clientId = getUserId(httpRequest);
            
            // Option de secours pour les tests
            if (clientId == null && request.getClientId() != null) {
                clientId = request.getClientId();
                log.warn("⚠️ Utilisation de l'ID client depuis la requête (mode test): {}", clientId);
            }
            
            if (clientId == null) {
                log.error("❌ Utilisateur non authentifié - impossible d'ajouter au panier");
                return ResponseEntity.status(401).build();
            }

            log.info("✅ Ajout du véhicule {} au panier de l'utilisateur {}", 
                    request.getVehiculeId(), clientId);

            List<Long> optionsIds = request.getOptionsIds() != null 
                ? Arrays.asList(request.getOptionsIds()) 
                : Collections.emptyList();

            Panier panier = panierService.ajouterAuPanier(clientId, request.getVehiculeId(), optionsIds);
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            
            log.info("✅ Véhicule ajouté avec succès - Panier ID: {}", panierDTO.getId());
            return ResponseEntity.ok(panierDTO);
            
        } catch (RuntimeException e) {
            log.error("❌ Erreur lors de l'ajout au panier: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    @Operation(summary = "Obtenir le panier de l'utilisateur connecté")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Panier trouvé",
            content = @Content(schema = @Schema(implementation = PanierDTO.class))),
        @ApiResponse(responseCode = "401", description = "Non authentifié")
    })
    @Transactional(readOnly = true) 
    public ResponseEntity<PanierDTO> getPanier(HttpServletRequest request) {
        try {
            log.info("🛒 Début récupération du panier");
            
            // Récupérer l'ID utilisateur
            Long clientId = getUserId(request);
            
            if (clientId == null) {
                log.error("❌ Utilisateur non authentifié - impossible de récupérer le panier");
                return ResponseEntity.status(401).build();
            }

            log.info("✅ Récupération du panier pour l'utilisateur {}", clientId);

            Optional<Panier> panierOpt = panierService.getPanierByClientId(clientId);
            if (panierOpt.isPresent()) {
                PanierDTO panierDTO = panierMapper.toDTO(panierOpt.get());
                log.info("✅ Panier trouvé avec {} articles", panierDTO.getLignes().size());
                return ResponseEntity.ok(panierDTO);
            } else {
                // Retourner un panier vide
                PanierDTO emptyPanier = new PanierDTO();
                emptyPanier.setId(0L);
                emptyPanier.setClientId(clientId);
                emptyPanier.setLignes(Collections.emptyList());
                emptyPanier.setMontantTotal(BigDecimal.valueOf(0.0));
                log.info("ℹ️ Aucun panier existant, retour d'un panier vide");
                return ResponseEntity.ok(emptyPanier);
            }
        } catch (Exception e) {
            log.error("❌ Erreur lors de la récupération du panier: {}", e.getMessage(), e);
            // En cas d'erreur, retourner un panier vide
            PanierDTO emptyPanier = new PanierDTO();
            emptyPanier.setId(0L);
            emptyPanier.setClientId(null);
            emptyPanier.setLignes(Collections.emptyList());
            emptyPanier.setMontantTotal(BigDecimal.valueOf(0.0));
            return ResponseEntity.ok(emptyPanier);
        }
    }

    @DeleteMapping("/retirer/{lignePanierId}")
    @Operation(summary = "Retirer une ligne du panier de l'utilisateur connecté")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ligne retirée du panier"),
        @ApiResponse(responseCode = "404", description = "Panier ou ligne non trouvée"),
        @ApiResponse(responseCode = "401", description = "Non authentifié")
    })
    public ResponseEntity<PanierDTO> retirerDuPanier(
            @Parameter(description = "ID de la ligne de panier", required = true)
            @PathVariable Long lignePanierId,
            HttpServletRequest request) {
        try {
            log.info("🗑️ Début suppression de la ligne de panier {}", lignePanierId);
            
            Long clientId = getUserId(request);
            
            if (clientId == null) {
                log.error("❌ Utilisateur non authentifié - impossible de retirer du panier");
                return ResponseEntity.status(401).build();
            }

            log.info("✅ Suppression de la ligne {} du panier de l'utilisateur {}", 
                    lignePanierId, clientId);

            Panier panier = panierService.retirerDuPanier(clientId, lignePanierId);
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            
            log.info("✅ Ligne supprimée avec succès");
            return ResponseEntity.ok(panierDTO);
            
        } catch (RuntimeException e) {
            log.error("❌ Erreur lors de la suppression de la ligne: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/vider")
    @Operation(summary = "Vider complètement le panier de l'utilisateur connecté")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Panier vidé"),
        @ApiResponse(responseCode = "401", description = "Non authentifié")
    })
    public ResponseEntity<String> viderPanier(HttpServletRequest request) {
        try {
            log.info("🧹 Début vidage du panier");
            
            Long clientId = getUserId(request);
            
            if (clientId == null) {
                log.error("❌ Utilisateur non authentifié - impossible de vider le panier");
                return ResponseEntity.status(401).build();
            }

            log.info("✅ Vidage du panier de l'utilisateur {}", clientId);
            panierService.viderPanier(clientId);
            
            log.info("✅ Panier vidé avec succès");
            return ResponseEntity.ok("Panier vidé avec succès");
            
        } catch (RuntimeException e) {
            log.error("❌ Erreur lors du vidage du panier: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Erreur lors du vidage du panier: " + e.getMessage());
        }
    }

    @GetMapping("/debug/auth")
    @Operation(summary = "Debug: Afficher les informations d'authentification")
    public ResponseEntity<Map<String, Object>> debugAuth(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Info du contexte de sécurité
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            response.put("authenticated", auth != null && auth.isAuthenticated());
            response.put("principalType", auth != null ? auth.getPrincipal().getClass().getName() : "null");
            response.put("principal", auth != null ? auth.getPrincipal().toString() : "null");
            response.put("authorities", auth != null ? auth.getAuthorities().toString() : "null");
            response.put("credentials", auth != null && auth.getCredentials() != null ? "présents" : "null");
            
            // ID depuis contexte
            Long userIdFromContext = getCurrentUserId();
            response.put("userIdFromContext", userIdFromContext);
            
            // ID depuis token
            Long userIdFromToken = getUserIdFromRequest(request);
            response.put("userIdFromToken", userIdFromToken);
            
            // ID final
            Long finalUserId = getUserId(request);
            response.put("finalUserId", finalUserId);
            
            // Informations du token
            String authHeader = request.getHeader("Authorization");
            response.put("hasAuthHeader", authHeader != null);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Map<String, Object> tokenInfo = jwtService.extractAllTokenInfo(token);
                    response.put("tokenInfo", tokenInfo);
                } catch (Exception e) {
                    response.put("tokenError", e.getMessage());
                }
            }
            
            // Informations de la base de données
            if (finalUserId != null) {
                Optional<com.vehicules.core.entities.Client> clientOpt = clientRepository.findById(finalUserId);
                if (clientOpt.isPresent()) {
                    com.vehicules.core.entities.Client client = clientOpt.get();
                    Map<String, Object> dbInfo = new HashMap<>();
                    dbInfo.put("id", client.getId());
                    dbInfo.put("email", client.getEmail());
                    dbInfo.put("nom", client.getNom());
                    dbInfo.put("prenom", client.getPrenom());
                    dbInfo.put("type", client.getClass().getSimpleName());
                    dbInfo.put("role", client.getRole());
                    response.put("databaseInfo", dbInfo);
                }
            }
            
            response.put("status", "success");
            log.info("✅ Debug auth réussi");
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("error", e.getMessage());
            log.error("❌ Erreur dans debug auth: {}", e.getMessage(), e);
        }
        
        return ResponseEntity.ok(response);
    }

    // ==================== CLASSES DE REQUÊTES INTERNES ====================

    public static class AjouterPanierRequest {
        @Schema(description = "ID du client (optionnel - sera extrait du token)", example = "1")
        private Long clientId;

        @Schema(description = "ID du véhicule", example = "1", required = true)
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
        @Schema(description = "ID du client (optionnel - sera extrait du token)", example = "1")
        private Long clientId;

        @Schema(description = "ID de la ligne de panier", example = "1", required = true)
        private Long lignePanierId;

        @Schema(description = "Nouvelle quantité", example = "2", required = true)
        private int nouvelleQuantite;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }

        public Long getLignePanierId() { return lignePanierId; }
        public void setLignePanierId(Long lignePanierId) { this.lignePanierId = lignePanierId; }

        public int getNouvelleQuantite() { return nouvelleQuantite; }
        public void setNouvelleQuantite(int nouvelleQuantite) { this.nouvelleQuantite = nouvelleQuantite; }
    }

    public static class AjouterOptionRequest {
        @Schema(description = "ID du client (optionnel - sera extrait du token)", example = "1")
        private Long clientId;

        @Schema(description = "ID de la ligne de panier", example = "1", required = true)
        private Long lignePanierId;

        @Schema(description = "ID de l'option", example = "1", required = true)
        private Long optionId;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }

        public Long getLignePanierId() { return lignePanierId; }
        public void setLignePanierId(Long lignePanierId) { this.lignePanierId = lignePanierId; }

        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
    }

    public static class RetirerOptionRequest {
        @Schema(description = "ID du client (optionnel - sera extrait du token)", example = "1")
        private Long clientId;

        @Schema(description = "ID de la ligne de panier", example = "1", required = true)
        private Long lignePanierId;

        @Schema(description = "ID de l'option", example = "1", required = true)
        private Long optionId;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }

        public Long getLignePanierId() { return lignePanierId; }
        public void setLignePanierId(Long lignePanierId) { this.lignePanierId = lignePanierId; }

        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
    }

    // Endpoints restants à implémenter...

    @PutMapping("/modifier-quantite")
    @Operation(summary = "Modifier la quantité d'une ligne de panier")
    public ResponseEntity<PanierDTO> modifierQuantite(@RequestBody ModifierQuantiteRequest request,
                                                      HttpServletRequest httpRequest) {
        try {
            Long clientId = getUserId(httpRequest);
            if (clientId == null && request.getClientId() != null) {
                clientId = request.getClientId();
            }
            
            if (clientId == null) {
                return ResponseEntity.status(401).build();
            }

            Panier panier = panierService.modifierQuantite(
                clientId,
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

    @PostMapping("/ajouter-option")
    @Operation(summary = "Ajouter une option à une ligne de panier")
    public ResponseEntity<PanierDTO> ajouterOption(@RequestBody AjouterOptionRequest request,
                                                   HttpServletRequest httpRequest) {
        try {
            Long clientId = getUserId(httpRequest);
            if (clientId == null && request.getClientId() != null) {
                clientId = request.getClientId();
            }
            
            if (clientId == null) {
                return ResponseEntity.status(401).build();
            }

            Panier panier = panierService.ajouterOption(
                clientId,
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
    public ResponseEntity<PanierDTO> retirerOption(@RequestBody RetirerOptionRequest request,
                                                   HttpServletRequest httpRequest) {
        try {
            Long clientId = getUserId(httpRequest);
            if (clientId == null && request.getClientId() != null) {
                clientId = request.getClientId();
            }
            
            if (clientId == null) {
                return ResponseEntity.status(401).build();
            }

            Panier panier = panierService.retirerOption(
                clientId,
                request.getLignePanierId(),
                request.getOptionId()
            );
            PanierDTO panierDTO = panierMapper.toDTO(panier);
            return ResponseEntity.ok(panierDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

}