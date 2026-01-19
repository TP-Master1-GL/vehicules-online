package com.vehicules.controllers;

import com.vehicules.core.entities.ClientParticulier;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.ClientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/setup")
@RequiredArgsConstructor
@Tag(name = "System Setup", description = "Endpoints pour l'initialisation du système")
public class SystemSetupController {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Operation(summary = "Vérifier l'existence de l'administrateur")
    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Object>> checkAdmin() {
        try {
            String adminEmail = "admin@vehicules.com";
            
            log.info("🔍 Vérification de l'administrateur: {}", adminEmail);
            
            var adminOpt = clientRepository.findByEmail(adminEmail);
            
            if (adminOpt.isPresent()) {
                var admin = adminOpt.get();
                
                return ResponseEntity.ok(Map.of(
                    "status", "exists",
                    "admin", Map.of(
                        "id", admin.getId(),
                        "email", admin.getEmail(),
                        "nom", admin.getNom(),
                        "role", admin.getRole(),
                        "enabled", admin.isEnabled()
                    ),
                    "password_info", Map.of(
                        "has_password", admin.getPassword() != null && !admin.getPassword().isEmpty(),
                        "hash_length", admin.getPassword() != null ? admin.getPassword().length() : 0,
                        "is_bcrypt_format", admin.getPassword() != null && admin.getPassword().startsWith("$2a$"),
                        "is_valid_length", admin.getPassword() != null && admin.getPassword().length() == 60
                    )
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "status", "not_found",
                    "message", "Aucun administrateur trouvé",
                    "action_required", "Utilisez POST /api/setup/create-admin"
                ));
            }
            
        } catch (Exception e) {
            log.error("Erreur vérification admin: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Créer un administrateur système")
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdmin() {
        try {
            String adminEmail = "admin@vehicules.com";
            String rawPassword = "zamba";
            
            log.info("⚙️ Création de l'administrateur système: {}", adminEmail);
            
            // Vérifier si existe déjà
            if (clientRepository.findByEmail(adminEmail).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "status", "error",
                        "message", "Un administrateur existe déjà",
                        "email", adminEmail,
                        "action", "Supprimez d'abord via DELETE /api/setup/delete-admin"
                    ));
            }
            
            // Créer l'admin
            ClientParticulier admin = new ClientParticulier();
            admin.setNom("Administrateur");
            admin.setEmail(adminEmail);
            admin.setTelephone("+33123456789");
            admin.setAdresse("Siège social, Paris");
            admin.setPrenom("Super");
            admin.setNumeroPermis("ADMIN-001");
            
            // Hacher le mot de passe
            String hashedPassword = passwordEncoder.encode(rawPassword);
            admin.setPassword(hashedPassword);
            
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            
            // Sauvegarder
            ClientParticulier savedAdmin = (ClientParticulier) clientRepository.save(admin);
            
            log.info("✅ Admin créé avec succès: ID={}, Hash={}...", 
                savedAdmin.getId(), 
                hashedPassword.substring(0, Math.min(30, hashedPassword.length())));
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Administrateur créé avec succès",
                "admin", Map.of(
                    "id", savedAdmin.getId(),
                    "email", savedAdmin.getEmail(),
                    "role", savedAdmin.getRole(),
                    "enabled", savedAdmin.getEnabled()
                ),
                "credentials", Map.of(
                    "email", adminEmail,
                    "password", rawPassword,
                    "note", "Utilisez ces identifiants pour vous connecter"
                )
            ));
            
        } catch (Exception e) {
            log.error("❌ Erreur création admin: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Supprimer l'administrateur")
    @DeleteMapping("/delete-admin")
    public ResponseEntity<Map<String, Object>> deleteAdmin() {
        try {
            String adminEmail = "admin@vehicules.com";
            
            log.info("🗑️ Suppression de l'administrateur: {}", adminEmail);
            
            var adminOpt = clientRepository.findByEmail(adminEmail);
            if (adminOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "status", "info",
                    "message", "Aucun administrateur trouvé"
                ));
            }
            
            clientRepository.delete(adminOpt.get());
            
            log.info("✅ Admin supprimé avec succès");
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Administrateur supprimé",
                "email", adminEmail
            ));
            
        } catch (Exception e) {
            log.error("❌ Erreur suppression admin: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Réinitialiser le mot de passe admin")
    @PostMapping("/reset-admin-password")
    public ResponseEntity<Map<String, Object>> resetAdminPassword(
            @RequestBody(required = false) Map<String, String> request) {
        
        try {
            String adminEmail = "admin@vehicules.com";
            String newPassword = request != null && request.containsKey("newPassword") 
                ? request.get("newPassword") 
                : "zamba"; // Par défaut
            
            log.info("🔐 Réinitialisation mot de passe admin: {}", adminEmail);
            
            var adminOpt = clientRepository.findByEmail(adminEmail);
            if (adminOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of(
                        "status", "error",
                        "message", "Administrateur non trouvé",
                        "action", "Créez d'abord l'admin via POST /api/setup/create-admin"
                    ));
            }
            
            var admin = adminOpt.get();
            if (!(admin instanceof ClientParticulier)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "L'utilisateur n'est pas un ClientParticulier"));
            }
            
            ClientParticulier adminParticulier = (ClientParticulier) admin;
            String hashedPassword = passwordEncoder.encode(newPassword);
            adminParticulier.setPassword(hashedPassword);
            
            clientRepository.save(adminParticulier);
            
            log.info("✅ Mot de passe admin réinitialisé");
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Mot de passe réinitialisé",
                "email", adminEmail,
                "new_password", newPassword,
                "note", "Utilisez le nouveau mot de passe pour vous connecter"
            ));
            
        } catch (Exception e) {
            log.error("❌ Erreur réinitialisation mot de passe: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Vérifier la connexion admin")
    @PostMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testAdminConnection() {
        try {
            String adminEmail = "admin@vehicules.com";
            
            log.info("🧪 Test de connexion pour: {}", adminEmail);
            
            var adminOpt = clientRepository.findByEmail(adminEmail);
            if (adminOpt.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "status", "admin_not_found",
                    "message", "Administrateur non trouvé",
                    "action", "POST /api/setup/create-admin"
                ));
            }
            
            var admin = adminOpt.get();
            String dbPassword = admin.getPassword();
            
            return ResponseEntity.ok(Map.of(
                "status", "admin_exists",
                "admin", Map.of(
                    "id", admin.getId(),
                    "email", admin.getEmail(),
                    "role", admin.getRole()
                ),
                "password_check", Map.of(
                    "has_password", dbPassword != null && !dbPassword.isEmpty(),
                    "password_length", dbPassword != null ? dbPassword.length() : 0,
                    "is_valid_bcrypt", dbPassword != null && dbPassword.startsWith("$2a$") 
                        && dbPassword.length() == 60
                ),
                "connection_test", "Pour tester la connexion réelle, utilisez POST /api/auth/login",
                "test_credentials", Map.of(
                    "email", adminEmail,
                    "password", "zamba" // Supposé être le mot de passe par défaut
                )
            ));
            
        } catch (Exception e) {
            log.error("❌ Erreur test connexion: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(summary = "Initialisation complète du système")
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, Object>> initializeSystem() {
        try {
            log.info("🚀 Initialisation complète du système...");
            
            Map<String, Object> results = new HashMap<>();
            List<String> steps = new ArrayList<>();
            
            // Étape 1: Créer l'admin si nécessaire
            var checkResult = checkAdmin();
            Map<String, Object> checkBody = (Map<String, Object>) checkResult.getBody();
            
            if ("exists".equals(checkBody.get("status"))) {
                steps.add("✅ Administrateur existe déjà");
                results.put("admin_status", "already_exists");
            } else {
                var createResult = createAdmin();
                if (createResult.getStatusCode().is2xxSuccessful()) {
                    steps.add("✅ Administrateur créé");
                    results.put("admin_status", "created");
                } else {
                    steps.add("❌ Échec création administrateur");
                    results.put("admin_status", "creation_failed");
                }
            }
            
            // Étape 2: Vérifier les services de base
            try {
                long clientsCount = clientRepository.count();
                steps.add("✅ Base de données accessible (" + clientsCount + " clients)");
                results.put("database_accessible", true);
                results.put("clients_count", clientsCount);
            } catch (Exception e) {
                steps.add("⚠️ Erreur base de données: " + e.getMessage());
                results.put("database_accessible", false);
            }
            
            log.info("🎯 Initialisation terminée - {} étapes exécutées", steps.size());
            
            return ResponseEntity.ok(Map.of(
                "status", "initialization_complete",
                "timestamp", new Date().toString(),
                "steps_executed", steps.size(),
                "steps", steps,
                "results", results,
                "next_actions", Arrays.asList(
                    "1. Connectez-vous à /api/auth/login avec admin@vehicules.com / zamba",
                    "2. Accédez au panel admin: /api/admin",
                    "3. Consultez la documentation: /swagger-ui.html"
                )
            ));
            
        } catch (Exception e) {
            log.error("❌ Erreur initialisation système: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "status", "error",
                    "message", "Erreur initialisation: " + e.getMessage()
                ));
        }
    }

    @Operation(summary = "Statut de santé du système")
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> systemHealth() {
        try {
            Map<String, Object> health = new HashMap<>();
            List<String> checks = new ArrayList<>();
            
            // Vérification base de données
            try {
                long clientsCount = clientRepository.count();
                checks.add("✅ Base de données accessible");
                health.put("database", "healthy");
                health.put("clients_count", clientsCount);
            } catch (Exception e) {
                checks.add("❌ Base de données inaccessible: " + e.getMessage());
                health.put("database", "unhealthy");
            }
            
            // Vérification admin
            var adminCheck = checkAdmin();
            Map<String, Object> adminBody = (Map<String, Object>) adminCheck.getBody();
            
            if ("exists".equals(adminBody.get("status"))) {
                checks.add("✅ Administrateur configuré");
                health.put("admin", "configured");
            } else {
                checks.add("⚠️ Administrateur non configuré");
                health.put("admin", "not_configured");
            }
            
            health.put("status", "running");
            health.put("timestamp", new Date().toString());
            health.put("checks", checks);
            health.put("total_checks", checks.size());
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            log.error("Erreur vérification santé: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
                ));
        }
    }
}