package com.vehicules.services;

import com.vehicules.core.entities.Client;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    @Value("${jwt.secret:vehicules-online-secret-key-for-jwt-token-generation-that-should-be-at-least-256-bits-long}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 heures en millisecondes
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration:604800000}") // 7 jours en millisecondes
    private long refreshExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        try {
            final Claims claims = extractAllClaims(token);
            // Vérifier si l'ID est stocké dans le token
            Object userIdObj = claims.get("userId");
            if (userIdObj != null) {
                if (userIdObj instanceof Integer) {
                    return ((Integer) userIdObj).longValue();
                } else if (userIdObj instanceof Long) {
                    return (Long) userIdObj;
                } else if (userIdObj instanceof String) {
                    try {
                        return Long.parseLong((String) userIdObj);
                    } catch (NumberFormatException e) {
                        log.warn("UserId dans le token n'est pas un nombre valide: {}", userIdObj);
                    }
                }
            }
            log.debug("Aucun userId trouvé dans le token");
            return null;
        } catch (Exception e) {
            log.error("Erreur lors de l'extraction de l'ID utilisateur du token: {}", e.getMessage());
            return null;
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(Client client) {
        return generateToken(new HashMap<>(), client);
    }

    public String generateToken(Map<String, Object> extraClaims, Client client) {
        // Ajouter l'ID utilisateur aux claims pour pouvoir le récupérer plus tard
        extraClaims.put("userId", client.getId());
        extraClaims.put("clientType", client.getClass().getSimpleName());
        
        return buildToken(extraClaims, client, jwtExpiration);
    }

    public String generateRefreshToken(Client client) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", client.getId());
        claims.put("clientType", client.getClass().getSimpleName());
        claims.put("isRefreshToken", true);
        
        return buildToken(claims, client, refreshExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, Client client, long expiration) {
        log.debug("Génération du token JWT pour le client ID: {}, Email: {}", 
                 client.getId(), client.getEmail());
        
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(client.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .claim("userId", client.getId()) // Stocker l'ID dans le token
                .claim("role", client.getRole() != null ? client.getRole().name() : "USER")
                .claim("nom", client.getNom())
                .claim("prenom", client.getPrenom())
                .claim("clientType", client.getClass().getSimpleName())
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public boolean isTokenValid(String token, Client client) {
        final String username = extractUsername(token);
        return (username.equals(client.getEmail())) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.error("Erreur lors de l'extraction des claims du token: {}", e.getMessage());
            throw e;
        }
    }

    private Key getSignInKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            log.error("Erreur lors de la génération de la clé de signature JWT: {}", e.getMessage());
            throw e;
        }
    }

    // Méthodes utilitaires pour extraire d'autres informations du token
    public String extractNom(String token) {
        try {
            final Claims claims = extractAllClaims(token);
            return claims.get("nom", String.class);
        } catch (Exception e) {
            log.warn("Erreur lors de l'extraction du nom du token: {}", e.getMessage());
            return null;
        }
    }

    public String extractPrenom(String token) {
        try {
            final Claims claims = extractAllClaims(token);
            return claims.get("prenom", String.class);
        } catch (Exception e) {
            log.warn("Erreur lors de l'extraction du prénom du token: {}", e.getMessage());
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            final Claims claims = extractAllClaims(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            log.warn("Erreur lors de l'extraction du rôle du token: {}", e.getMessage());
            return null;
        }
    }

    public String extractClientType(String token) {
        try {
            final Claims claims = extractAllClaims(token);
            return claims.get("clientType", String.class);
        } catch (Exception e) {
            log.warn("Erreur lors de l'extraction du type de client du token: {}", e.getMessage());
            return null;
        }
    }

    // Vérifier si c'est un refresh token
    public boolean isRefreshToken(String token) {
        try {
            final Claims claims = extractAllClaims(token);
            Boolean isRefresh = claims.get("isRefreshToken", Boolean.class);
            return isRefresh != null && isRefresh;
        } catch (Exception e) {
            return false;
        }
    }

    // Obtenir toutes les informations du token sous forme de Map
    public Map<String, Object> extractAllTokenInfo(String token) {
        try {
            final Claims claims = extractAllClaims(token);
            Map<String, Object> tokenInfo = new HashMap<>();
            
            tokenInfo.put("username", claims.getSubject());
            tokenInfo.put("userId", claims.get("userId"));
            tokenInfo.put("nom", claims.get("nom"));
            tokenInfo.put("prenom", claims.get("prenom"));
            tokenInfo.put("role", claims.get("role"));
            tokenInfo.put("clientType", claims.get("clientType"));
            tokenInfo.put("issuedAt", claims.getIssuedAt());
            tokenInfo.put("expiration", claims.getExpiration());
            
            return tokenInfo;
        } catch (Exception e) {
            log.error("Erreur lors de l'extraction des informations du token: {}", e.getMessage());
            return new HashMap<>();
        }
    }
}