package com.vehicules.controllers;

import com.vehicules.core.entities.Societe;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.Filiale;
import com.vehicules.services.SocieteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/societe")
@RequiredArgsConstructor
public class SocieteController {

    private final SocieteService societeService;

    /**
     * Récupérer les informations de l'entreprise
     */
    @GetMapping
    public ResponseEntity<Societe> getSociete() {
        Societe societe = societeService.getSocieteParDefaut();
        return ResponseEntity.ok(societe);
    }

    /**
     * Récupérer les filiales de l'entreprise
     */
    @GetMapping("/filiales")
    public ResponseEntity<List<Filiale>> getFiliales() {
        Societe societe = societeService.getSocieteParDefaut();
        return ResponseEntity.ok(societe.getFiliales());
    }

    /**
     * Récupérer les commandes de l'entreprise (flotte)
     */
    @GetMapping("/commandes")
    public ResponseEntity<List<Commande>> getCommandesSociete(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        List<Commande> commandes = societeService.getCommandesSociete(statut, page, size);
        return ResponseEntity.ok(commandes);
    }

    /**
     * Récupérer les statistiques de la flotte
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistiquesFlotte() {
        Map<String, Object> stats = societeService.getStatistiquesFlotte();
        return ResponseEntity.ok(stats);
    }
}
