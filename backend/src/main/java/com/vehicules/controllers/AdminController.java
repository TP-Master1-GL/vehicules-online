package com.vehicules.controllers;

import com.vehicules.api.dto.VehiculeDTO;
import com.vehicules.core.entities.*;
import com.vehicules.core.entities.AutomobileElectrique;
import com.vehicules.core.entities.AutomobileEssence;
import com.vehicules.core.entities.ScooterElectrique;
import com.vehicules.core.entities.ScooterEssence;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.*;
import com.vehicules.services.CatalogueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private OptionVehiculeRepository optionVehiculeRepository;

    @Autowired
    private CatalogueService catalogueService;

    private boolean isClientEnabled(Client client) {
        if (client instanceof ClientParticulier) {
            ClientParticulier cp = (ClientParticulier) client;
            return cp.getEnabled() != null ? cp.getEnabled() : true;
        }
        return true; // Les sociétés sont toujours actives par défaut
    }

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<Client>> getAllUtilisateurs(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false, defaultValue = "true") boolean actif) {

        List<Client> utilisateurs;

        if (role != null) {
            utilisateurs = clientRepository.findAll().stream()
                    .filter(u -> u.getRole() == role && isClientEnabled(u) == actif)
                    .toList();
        } else {
            utilisateurs = clientRepository.findAll().stream()
                    .filter(u -> isClientEnabled(u) == actif)
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
            if (user instanceof ClientParticulier) {
                ((ClientParticulier) user).setEnabled(false);
                user = clientRepository.save(user);
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.badRequest().build();
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

    // ========== GESTION DES VÉHICULES ==========

    @GetMapping("/vehicules")
    public ResponseEntity<List<VehiculeDTO>> getAllVehicules() {
        List<VehiculeDTO> vehicules = catalogueService.getCatalogueUneLigne();
        return ResponseEntity.ok(vehicules);
    }

    @GetMapping("/vehicules/{id}")
    public ResponseEntity<VehiculeDTO> getVehiculeById(@PathVariable Long id) {
        VehiculeDTO vehicule = catalogueService.getVehiculeById(id);
        return ResponseEntity.ok(vehicule);
    }

    @PostMapping("/vehicules")
    public ResponseEntity<Vehicule> createVehicule(@RequestBody Map<String, Object> vehiculeData) {
        Vehicule vehicule = createVehiculeFromData(vehiculeData);
        Vehicule saved = vehiculeRepository.save(vehicule);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/vehicules/{id}")
    public ResponseEntity<Vehicule> updateVehicule(@PathVariable Long id, @RequestBody Map<String, Object> vehiculeData) {
        Optional<Vehicule> vehiculeOpt = vehiculeRepository.findById(id);
        if (vehiculeOpt.isPresent()) {
            Vehicule vehicule = vehiculeOpt.get();
            updateVehiculeFromData(vehicule, vehiculeData);
            Vehicule updated = vehiculeRepository.save(vehicule);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/vehicules/{id}")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        if (vehiculeRepository.existsById(id)) {
            vehiculeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/vehicules/{id}/solde")
    public ResponseEntity<Vehicule> mettreEnSolde(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Optional<Vehicule> vehiculeOpt = vehiculeRepository.findById(id);
        if (vehiculeOpt.isPresent()) {
            Vehicule vehicule = vehiculeOpt.get();
            vehicule.setEnSolde(true);
            if (request.containsKey("pourcentageSolde")) {
                BigDecimal pourcentage = new BigDecimal(request.get("pourcentageSolde").toString());
                vehicule.setPourcentageSolde(pourcentage);
            }
            Vehicule updated = vehiculeRepository.save(vehicule);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // ========== GESTION DES COMMANDES ==========

    @GetMapping("/commandes")
    public ResponseEntity<List<Commande>> getAllCommandes(
            @RequestParam(required = false) String statut) {
        List<Commande> commandes;
        if (statut != null && !statut.isEmpty()) {
            commandes = commandeRepository.findByStatut(statut);
        } else {
            commandes = commandeRepository.findAll();
        }
        return ResponseEntity.ok(commandes);
    }

    @GetMapping("/commandes/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable Long id) {
        Optional<Commande> commandeOpt = commandeRepository.findById(id);
        return commandeOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/commandes/{id}/statut")
    public ResponseEntity<Commande> updateCommandeStatut(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Optional<Commande> commandeOpt = commandeRepository.findById(id);
        if (commandeOpt.isPresent()) {
            Commande commande = commandeOpt.get();
            commande.setStatut(request.get("statut"));
            Commande updated = commandeRepository.save(commande);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // ========== GESTION DES OPTIONS ==========

    @GetMapping("/options")
    public ResponseEntity<List<OptionVehicule>> getAllOptions() {
        List<OptionVehicule> options = optionVehiculeRepository.findAll();
        return ResponseEntity.ok(options);
    }

    @PostMapping("/options")
    public ResponseEntity<OptionVehicule> createOption(@RequestBody OptionVehicule option) {
        OptionVehicule saved = optionVehiculeRepository.save(option);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/options/{id}")
    public ResponseEntity<OptionVehicule> updateOption(@PathVariable Long id, @RequestBody OptionVehicule option) {
        if (optionVehiculeRepository.existsById(id)) {
            option.setId(id);
            OptionVehicule updated = optionVehiculeRepository.save(option);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/options/{id}")
    public ResponseEntity<Void> deleteOption(@PathVariable Long id) {
        if (optionVehiculeRepository.existsById(id)) {
            optionVehiculeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ========== MÉTHODES UTILITAIRES PRIVÉES ==========

    private Vehicule createVehiculeFromData(Map<String, Object> data) {
        String type = (String) data.get("type"); // "AUTOMOBILE" ou "SCOOTER"
        String energie = (String) data.get("energie"); // "ESSENCE", "ELECTRIQUE"

        Vehicule vehicule;

        if ("AUTOMOBILE".equals(type)) {
            if ("ELECTRIQUE".equals(energie)) {
                AutomobileElectrique auto = new AutomobileElectrique();
                auto.setAutonomie(((Number) data.get("autonomie")).intValue());
                auto.setTempsChargeRapide(((Number) data.get("tempsChargeRapide")).intValue());
                auto.setTypeChargeur((String) data.get("typeChargeur"));
                vehicule = auto;
            } else {
                AutomobileEssence auto = new AutomobileEssence();
                auto.setConsommation(new BigDecimal(data.get("consommation").toString()));
                auto.setCarburant((String) data.get("carburant"));
                auto.setAutonomie(((Number) data.get("autonomie")).intValue());
                vehicule = auto;
            }
            Automobile auto = (Automobile) vehicule;
            auto.setNombrePortes(((Number) data.get("nombrePortes")).intValue());
            auto.setNombrePlaces(((Number) data.get("nombrePlaces")).intValue());
            auto.setCouleur((String) data.get("couleur"));
            auto.setPuissance(((Number) data.get("puissance")).intValue());
            auto.setTransmission((String) data.get("transmission"));
        } else { // SCOOTER
            if ("ELECTRIQUE".equals(energie)) {
                ScooterElectrique scooter = new ScooterElectrique();
                scooter.setAutonomie(((Number) data.get("autonomie")).intValue());
                scooter.setTempsCharge(((Number) data.get("tempsCharge")).intValue());
                scooter.setTypeBatterie((String) data.get("typeBatterie"));
                vehicule = scooter;
            } else {
                ScooterEssence scooter = new ScooterEssence();
                scooter.setConsommation(new BigDecimal(data.get("consommation").toString()));
                scooter.setCarburant((String) data.get("carburant"));
                scooter.setAutonomie(((Number) data.get("autonomie")).intValue());
                vehicule = scooter;
            }
            Scooter scooter = (Scooter) vehicule;
            scooter.setCouleur((String) data.get("couleur"));
            scooter.setCylindree(((Number) data.get("cylindree")).intValue());
            scooter.setCategoriePermis((String) data.get("categoriePermis"));
        }

        // Propriétés communes
        vehicule.setMarque((String) data.get("marque"));
        vehicule.setModele((String) data.get("modele"));
        vehicule.setPrixBase(new BigDecimal(data.get("prixBase").toString()));
        vehicule.setDateStock(LocalDate.parse(data.get("dateStock").toString()));
        vehicule.setEnSolde(data.containsKey("enSolde") && (Boolean) data.get("enSolde"));
        if (data.containsKey("pourcentageSolde")) {
            vehicule.setPourcentageSolde(new BigDecimal(data.get("pourcentageSolde").toString()));
        }

        return vehicule;
    }

    private void updateVehiculeFromData(Vehicule vehicule, Map<String, Object> data) {
        if (data.containsKey("marque")) vehicule.setMarque((String) data.get("marque"));
        if (data.containsKey("modele")) vehicule.setModele((String) data.get("modele"));
        if (data.containsKey("prixBase")) vehicule.setPrixBase(new BigDecimal(data.get("prixBase").toString()));
        if (data.containsKey("dateStock")) vehicule.setDateStock(LocalDate.parse(data.get("dateStock").toString()));
        if (data.containsKey("enSolde")) vehicule.setEnSolde((Boolean) data.get("enSolde"));
        if (data.containsKey("pourcentageSolde")) {
            vehicule.setPourcentageSolde(new BigDecimal(data.get("pourcentageSolde").toString()));
        }

        // Mise à jour spécifique selon le type
        if (vehicule instanceof Automobile) {
            Automobile auto = (Automobile) vehicule;
            if (data.containsKey("nombrePortes")) auto.setNombrePortes(((Number) data.get("nombrePortes")).intValue());
            if (data.containsKey("nombrePlaces")) auto.setNombrePlaces(((Number) data.get("nombrePlaces")).intValue());
            if (data.containsKey("couleur")) auto.setCouleur((String) data.get("couleur"));
            if (data.containsKey("puissance")) auto.setPuissance(((Number) data.get("puissance")).intValue());
            if (data.containsKey("transmission")) auto.setTransmission((String) data.get("transmission"));
        } else if (vehicule instanceof Scooter) {
            Scooter scooter = (Scooter) vehicule;
            if (data.containsKey("couleur")) scooter.setCouleur((String) data.get("couleur"));
            if (data.containsKey("cylindree")) scooter.setCylindree(((Number) data.get("cylindree")).intValue());
            if (data.containsKey("categoriePermis")) scooter.setCategoriePermis((String) data.get("categoriePermis"));
        }
    }
}
