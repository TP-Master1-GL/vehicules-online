package com.vehicules.api.controllers;

import com.vehicules.api.dto.CommandeDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
@Tag(name = "Commandes", description = "API pour la gestion des commandes")
public class CommandeController {

    @PostMapping
    @Operation(summary = "Créer une nouvelle commande")
    public ResponseEntity<CommandeDTO> creerCommande(@RequestBody CreerCommandeRequest request) {
        // TODO: Implémenter la création de commande avec Factory Method
        CommandeDTO commande = new CommandeDTO();
        return ResponseEntity.ok(commande);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une commande par son ID")
    public ResponseEntity<CommandeDTO> getCommandeById(@PathVariable Long id) {
        // TODO: Implémenter la récupération de commande
        CommandeDTO commande = new CommandeDTO();
        return ResponseEntity.ok(commande);
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Obtenir les commandes d'un client")
    public ResponseEntity<String> getCommandesByClient(@PathVariable Long clientId) {
        // TODO: Implémenter la récupération des commandes par client
        return ResponseEntity.ok("Commandes du client");
    }

    @PutMapping("/{id}/statut")
    @Operation(summary = "Mettre à jour le statut d'une commande")
    public ResponseEntity<String> updateStatutCommande(@PathVariable Long id, @RequestBody UpdateStatutRequest request) {
        // TODO: Implémenter la mise à jour du statut
        return ResponseEntity.ok("Statut mis à jour");
    }

    // Classes internes pour les requêtes
    public static class CreerCommandeRequest {
        private Long clientId;
        private String typePaiement; // COMPTANT ou CREDIT
        private Long[] vehiculeIds;

        // Getters et setters
        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        public String getTypePaiement() { return typePaiement; }
        public void setTypePaiement(String typePaiement) { this.typePaiement = typePaiement; }
        public Long[] getVehiculeIds() { return vehiculeIds; }
        public void setVehiculeIds(Long[] vehiculeIds) { this.vehiculeIds = vehiculeIds; }
    }

    public static class UpdateStatutRequest {
        private String statut;

        public String getStatut() { return statut; }
        public void setStatut(String statut) { this.statut = statut; }
    }
}
