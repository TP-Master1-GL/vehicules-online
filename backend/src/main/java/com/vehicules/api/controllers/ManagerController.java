package com.vehicules.api.controllers;

import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.Vehicule;
import com.vehicules.core.enums.StatutCommande;
import com.vehicules.repositories.ClientRepository;
import com.vehicules.repositories.CommandeRepository;
import com.vehicules.repositories.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
public class ManagerController {

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        // Statistiques du jour
        LocalDate today = LocalDate.now();
        long commandesDuJour = commandeRepository.count();
        long vehiculesEnStock = vehiculeRepository.count();
        long clientsTotaux = clientRepository.count();

        // Calcul du CA (simplifié)
        double chiffreAffaires = commandeRepository.findAll().stream()
                .mapToDouble(c -> c.getMontantTotal() != null ? c.getMontantTotal().doubleValue() : 0.0)
                .sum();

        Map<String, Object> dashboard = Map.of(
            "commandesDuJour", commandesDuJour,
            "vehiculesEnStock", vehiculesEnStock,
            "clientsTotaux", clientsTotaux,
            "chiffreAffaires", chiffreAffaires,
            "date", today
        );

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/vehicules")
    public ResponseEntity<List<Vehicule>> getAllVehicules() {
        List<Vehicule> vehicules = vehiculeRepository.findAll();
        return ResponseEntity.ok(vehicules);
    }

    @PostMapping("/vehicules")
    public ResponseEntity<Vehicule> addVehicule(@RequestBody Vehicule vehicule) {
        Vehicule savedVehicule = vehiculeRepository.save(vehicule);
        return ResponseEntity.ok(savedVehicule);
    }

    @PutMapping("/vehicules/{id}")
    public ResponseEntity<Vehicule> updateVehicule(@PathVariable Long id, @RequestBody Vehicule vehicule) {
        vehicule.setId(id);
        Vehicule updatedVehicule = vehiculeRepository.save(vehicule);
        return ResponseEntity.ok(updatedVehicule);
    }

    @DeleteMapping("/vehicules/{id}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        vehiculeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/commandes/pending")
    public ResponseEntity<List<Commande>> getPendingCommandes() {
        List<Commande> pendingCommandes = commandeRepository.findByStatut(StatutCommande.EN_COURS.name());
        return ResponseEntity.ok(pendingCommandes);
    }

    @PutMapping("/commandes/{id}/valider")
    public ResponseEntity<Commande> validerCommande(@PathVariable Long id) {
        Commande commande = commandeRepository.findById(id).orElse(null);
        if (commande != null) {
            commande.setStatut(StatutCommande.VALIDEE.name());
            commande = commandeRepository.save(commande);
        }
        return ResponseEntity.ok(commande);
    }

    @PutMapping("/commandes/{id}/rejeter")
    public ResponseEntity<Commande> rejeterCommande(@PathVariable Long id) {
        Commande commande = commandeRepository.findById(id).orElse(null);
        if (commande != null) {
            commande.setStatut(StatutCommande.ANNULEE.name());
            commande = commandeRepository.save(commande);
        }
        return ResponseEntity.ok(commande);
    }

    @GetMapping("/reports/ventes-mensuelles")
    public ResponseEntity<Map<String, Object>> getVentesRapport(@RequestParam String format) {
        // Rapport de ventes mensuelles
        double totalVentes = commandeRepository.findAll().stream()
                .filter(c -> StatutCommande.VALIDEE.name().equals(c.getStatut()))
                .mapToDouble(c -> c.getMontantTotal() != null ? c.getMontantTotal().doubleValue() : 0.0)
                .sum();

        Map<String, Object> rapport = Map.of(
            "periode", "Mensuel",
            "totalVentes", totalVentes,
            "nombreCommandes", commandeRepository.count(),
            "format", format
        );

        return ResponseEntity.ok(rapport);
    }
}
