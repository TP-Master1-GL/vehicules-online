package com.vehicules.controllers;

import com.vehicules.api.dto.auth.AuthenticationResponseDTO;
import com.vehicules.api.dto.auth.LoginRequestDTO;
import com.vehicules.api.dto.auth.RegisterRequestDTO;
import com.vehicules.services.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request, BindingResult bindingResult) {
        // Vérifier les erreurs de validation
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(Map.of("errors", errors, "message", "Données d'inscription invalides"));
        }

        try {
            AuthenticationResponseDTO response = authenticationService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Erreur interne du serveur: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequestDTO request) {
        logger.info("Tentative de connexion pour l'email: {}", request.getEmail());
        try {
            AuthenticationResponseDTO response = authenticationService.authenticate(request);
            logger.info("Connexion réussie pour l'email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Erreur d'authentification pour {}: {}", request.getEmail(), e.getMessage());
            // Gestion spécifique des erreurs d'authentification
            if (e.getMessage().contains("Utilisateur non trouvé")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email ou mot de passe incorrect"));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur interne lors de la connexion pour {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("message", "Erreur interne du serveur: " + e.getMessage()));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(@RequestBody String refreshToken) {
        // TODO: Implémenter le refresh token
        return ResponseEntity.ok("Refresh token functionality - TODO");

    }
    

}


