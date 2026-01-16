// src/main/java/com/vehicules/controllers/CalculTemplateController.java
package com.vehicules.controllers;

import com.vehicules.api.dto.CalculCommandeDTO;
import com.vehicules.core.entities.Commande;
import com.vehicules.repositories.CommandeRepository;
import com.vehicules.services.CommandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/calcul-template")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CalculTemplateController {

    private final CommandeRepository commandeRepository;
    private final CommandeService commandeService;

    @GetMapping("/commande/{commandeId}")
    public ResponseEntity<CalculCommandeDTO> calculerAvecTemplate(@PathVariable Long commandeId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        // Calculer les différents montants avec le pattern Template
        BigDecimal sousTotal = commandeService.calculerSousTotalTemplate(commande);
        BigDecimal tva = commandeService.calculerTVA(commande);
        BigDecimal total = commandeService.calculerMontantAvecTemplate(commande);

        CalculCommandeDTO dto = new CalculCommandeDTO();
        dto.setCommandeId(commandeId);
        dto.setPaysLivraison(commande.getPaysLivraison());
        dto.setSousTotal(sousTotal);
        dto.setMontantTVA(tva);
        dto.setRemise(BigDecimal.ZERO); // À adapter si vous calculez les remises
        dto.setFraisLivraison(total.subtract(sousTotal.add(tva)));
        dto.setTotal(total);
        dto.setTypeCalcul("PATTERN_TEMPLATE");

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/simulation")
    public ResponseEntity<Map<String, Object>> simulerCalculTemplate(
            @RequestParam String pays,
            @RequestParam BigDecimal montantBase,
            @RequestParam(defaultValue = "false") boolean vehiculeElectrique,
            @RequestParam(defaultValue = "false") boolean entreprise) {

        // Créer une commande de simulation
        Commande commandeSimulee = new Commande() {
            @Override
            public String getTypePaiement() {
                return "COMPTANT";
            }

            @Override
            public String getPaysLivraison() {
                return pays;
            }
        };

        Map<String, Object> result = new HashMap<>();
        result.put("pays", pays);
        result.put("montantBase", montantBase);
        result.put("vehiculeElectrique", vehiculeElectrique);
        result.put("entreprise", entreprise);
        result.put("note", "Calcul basé sur le pattern Template");

        // Cette simulation nécessiterait une implémentation plus complète
        // avec des lignes de commande simulées

        return ResponseEntity.ok(result);
    }

    @GetMapping("/comparaison/{commandeId}")
    public ResponseEntity<Map<String, Object>> comparerCalculs(@PathVariable Long commandeId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));

        // Calcul standard
        BigDecimal montantStandard = commande.calculerMontantTotal();

        // Calcul avec template
        BigDecimal montantTemplate = commandeService.calculerMontantAvecTemplate(commande);

        Map<String, Object> result = new HashMap<>();
        result.put("commandeId", commandeId);
        result.put("paysLivraison", commande.getPaysLivraison());
        result.put("montantStandard", montantStandard);
        result.put("montantTemplate", montantTemplate);
        result.put("difference", montantTemplate.subtract(montantStandard).abs());
        result.put("pourcentageDifference", montantTemplate.subtract(montantStandard)
                .divide(montantStandard, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100)));

        return ResponseEntity.ok(result);
    }
}