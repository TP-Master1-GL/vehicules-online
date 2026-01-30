package com.vehicules.controllers;

import com.vehicules.core.entities.Client;
import com.vehicules.repositories.ClientRepository;
import com.vehicules.services.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthRefreshController {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private ClientRepository clientRepository;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String oldToken = request.getToken();
            
            // Extraire l'email du token (même s'il est expiré)
            String userEmail = jwtService.extractUsername(oldToken);
            
            if (userEmail == null || userEmail.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "error", "Token invalide",
                        "message", "Impossible d'extraire les informations d'identification"
                    ));
            }
            
            // Trouver le client
            Client client = clientRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            // Vérifier si le token peut être rafraîchi
            if (!jwtService.isTokenValidForRefresh(oldToken, client)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "error", "Token trop vieux",
                        "message", "Le token est trop vieux pour être rafraîchi. Veuillez vous reconnecter."
                    ));
            }
            
            // Générer un nouveau token
            String newToken = jwtService.generateToken(client);
            String refreshToken = jwtService.generateRefreshToken(client);
            
            return ResponseEntity.ok(Map.of(
                "token", newToken,
                "refreshToken", refreshToken,
                "userId", client.getId(),
                "email", client.getEmail(),
                "nom", client.getNom(),
                "prenom", client.getPrenom(),
                "role", client.getRole().name()
            ));
            
        } catch (ExpiredJwtException e) {
            // Le token est expiré, mais on peut quand même tenter de le rafraîchir
            try {
                // Extraire l'email du token expiré
                String userEmail = e.getClaims().getSubject();
                Client client = clientRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
                
                // Vérifier si le token expiré peut être rafraîchi
                if (!jwtService.isTokenValidForRefresh(request.getToken(), client)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                            "error", "Session expirée",
                            "message", "Votre session a expiré. Veuillez vous reconnecter."
                        ));
                }
                
                // Générer un nouveau token
                String newToken = jwtService.generateToken(client);
                String refreshToken = jwtService.generateRefreshToken(client);
                
                return ResponseEntity.ok(Map.of(
                    "token", newToken,
                    "refreshToken", refreshToken,
                    "userId", client.getId(),
                    "email", client.getEmail(),
                    "nom", client.getNom(),
                    "prenom", client.getPrenom(),
                    "role", client.getRole().name()
                ));
                
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "error", "Erreur de rafraîchissement",
                        "message", "Impossible de rafraîchir le token: " + ex.getMessage()
                    ));
            }
            
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "error", "Token invalide",
                    "message", "Le token fourni n'est pas valide: " + e.getMessage()
                ));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "error", "Utilisateur non trouvé",
                    "message", e.getMessage()
                ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Erreur interne",
                    "message", "Une erreur est survenue lors du rafraîchissement du token"
                ));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody ValidateTokenRequest request) {
        try {
            String token = request.getToken();
            String userEmail = jwtService.extractUsername(token);
            
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Token invalide"));
            }
            
            Client client = clientRepository.findByEmail(userEmail).orElse(null);
            
            if (client == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Utilisateur non trouvé"));
            }
            
            boolean isValid = jwtService.isTokenValid(token, client);
            boolean isExpired = jwtService.isTokenExpired(token);
            
            if (isValid) {
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "userId", client.getId(),
                    "email", client.getEmail(),
                    "nom", client.getNom(),
                    "prenom", client.getPrenom(),
                    "role", client.getRole().name(),
                    "expired", false
                ));
            } else if (isExpired) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "valid", false,
                        "expired", true,
                        "message", "Token expiré",
                        "canRefresh", jwtService.isTokenValidForRefresh(token, client)
                    ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Token invalide"));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("valid", false, "message", "Erreur de validation: " + e.getMessage()));
        }
    }
    
    @Data
    public static class RefreshTokenRequest {
        private String token;
    }
    
    @Data
    public static class ValidateTokenRequest {
        private String token;
    }
}