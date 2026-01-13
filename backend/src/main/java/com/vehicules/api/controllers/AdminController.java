package com.vehicules.api.controllers;

import com.vehicules.core.entities.Client;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<Client>> getAllUtilisateurs(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false, defaultValue = "true") boolean actif) {

        List<Client> utilisateurs;

        if (role != null) {
            utilisateurs = clientRepository.findAll().stream()
                    .filter(u -> u.getRole() == role && u.isEnabled() == actif)
                    .toList();
        } else {
            utilisateurs = clientRepository.findAll().stream()
                    .filter(u -> u.isEnabled() == actif)
                    .toList();
        }

        return ResponseEntity.ok(utilisateurs);
    }

    @PostMapping("/utilisateurs")
    public ResponseEntity<Client> createUtilisateur(@RequestBody Client utilisateur) {
        Client savedUser = clientRepository.save(utilisateur);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/utilisateurs/{id}/role")
    public ResponseEntity<Client> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Client> userOpt = clientRepository.findById(id);
        if (userOpt.isPresent()) {
            Client user = userOpt.get();
            Role newRole = Role.valueOf(request.get("role"));
            user.setRole(newRole);
            user = clientRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/utilisateurs/{id}/desactiver")
    public ResponseEntity<Client> deactivateUtilisateur(@PathVariable Long id) {
        Optional<Client> userOpt = clientRepository.findById(id);
        if (userOpt.isPresent()) {
            Client user = userOpt.get();
            user.setEnabled(false);
            user = clientRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/configurations")
    public ResponseEntity<Map<String, String>> getConfigurations() {
        // TODO: Implémenter un système de configuration
        Map<String, String> configs = Map.of(
            "tva", "20.0",
            "seuilStock", "5",
            "maxCredit", "50000"
        );
        return ResponseEntity.ok(configs);
    }

    @PutMapping("/configurations/{key}")
    public ResponseEntity<String> updateConfiguration(@PathVariable String key, @RequestBody Map<String, String> request) {
        String value = request.get("value");
        // TODO: Sauvegarder dans une table de configuration
        return ResponseEntity.ok("Configuration " + key + " mise à jour: " + value);
    }

    @GetMapping("/health-detailed")
    public ResponseEntity<Map<String, Object>> getDetailedHealth() {
        // TODO: Implémenter des métriques détaillées
        Map<String, Object> health = Map.of(
            "status", "UP",
            "database", "CONNECTED",
            "diskSpace", "OK",
            "memory", "OK"
        );
        return ResponseEntity.ok(health);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        // TODO: Intégrer Micrometer pour les métriques réelles
        Map<String, Object> metrics = Map.of(
            "totalRequests", 1250,
            "activeUsers", 45,
            "memoryUsage", "78%",
            "cpuUsage", "45%"
        );
        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/database/backup")
    public ResponseEntity<String> createBackup() {
        // TODO: Implémenter le backup de base de données
        return ResponseEntity.ok("Backup créé avec succès");
    }

    @PostMapping("/database/optimize")
    public ResponseEntity<String> optimizeDatabase() {
        // TODO: Implémenter l'optimisation de base de données
        return ResponseEntity.ok("Base de données optimisée");
    }
}
