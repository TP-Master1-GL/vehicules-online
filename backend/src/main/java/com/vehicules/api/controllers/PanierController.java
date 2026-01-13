package com.vehicules.api.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/panier")

@RequiredArgsConstructor


@Tag(name = "Panier", description = "API pour la gestion du panier d'achat")
public class PanierController {

    @PostMapping("/ajouter")
    @Operation(summary = "Ajouter un véhicule au panier")
    public ResponseEntity<String> ajouterAuPanier(@RequestBody AjouterPanierRequest request) {
        // TODO: Implémenter la logique d'ajout au panier
        return ResponseEntity.ok("Véhicule ajouté au panier");
    }

    @DeleteMapping("/retirer/{vehiculeId}")
    @Operation(summary = "Retirer un véhicule du panier")
    public ResponseEntity<String> retirerDuPanier(@PathVariable Long vehiculeId) {
        // TODO: Implémenter la logique de retrait du panier
        return ResponseEntity.ok("Véhicule retiré du panier");
    }

    @GetMapping
    @Operation(summary = "Obtenir le contenu du panier")
    public ResponseEntity<String> getPanier() {
        // TODO: Implémenter la récupération du panier
        return ResponseEntity.ok("Contenu du panier");
    }

    // Classe interne pour la requête
    @Setter
    @Getter
    public static class AjouterPanierRequest {
        // Getters et setters
        private Long vehiculeId;
        private Long[] optionsIds;

    }
}
