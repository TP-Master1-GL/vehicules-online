package com.vehicules.services;

import com.vehicules.core.entities.Client;
import io.jsonwebtoken.*;
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
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (ExpiredJwtException e) {
            log.warn("Token expiré lors de l'extraction de claim: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            log.error("Erreur JWT lors de l'extraction de claim: {}", e.getMessage());
            throw e;
        }
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
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.warn("Token expiré pour l'utilisateur: {}", userDetails.getUsername());
            return false;
        } catch (JwtException e) {
            log.error("Token invalide: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenValid(String token, Client client) {
        try {
            final String username = extractUsername(token);
            return (username.equals(client.getEmail())) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            log.warn("Token expiré pour le client: {}", client.getEmail());
            return false;
        } catch (JwtException e) {
            log.error("Token invalide pour le client {}: {}", client.getEmail(), e.getMessage());
            return false;
        }
    }
    
    /**
     * Vérifie si un token expiré peut être rafraîchi
     * Permet de rafraîchir un token expiré jusqu'à 7 jours après son expiration
     */
    public boolean isTokenValidForRefresh(String token, Client client) {
        try {
            // Vérifier si le token appartient bien à l'utilisateur
            final String username = extractUsername(token);
            if (!username.equals(client.getEmail())) {
                log.warn("Token ne correspond pas à l'utilisateur pour rafraîchissement: {} vs {}", 
                        username, client.getEmail());
                return false;
            }
            
            // Extraire les claims sans vérifier l'expiration
            Claims claims = extractAllClaimsIgnoringExpiration(token);
            
            // Vérifier que le token n'est pas trop vieux pour être rafraîchi
            // (par exemple, on ne rafraîchit pas les tokens expirés depuis plus de 7 jours)
            Date expiration = claims.getExpiration();
            long maxAgeForRefresh = 7 * 24 * 60 * 60 * 1000L; // 7 jours en millisecondes
            long timeSinceExpiration = new Date().getTime() - expiration.getTime();
            
            boolean isValid = timeSinceExpiration <= maxAgeForRefresh;
            
            if (!isValid) {
                log.warn("Token trop vieux pour être rafraîchi: expiré depuis {} jours", 
                        timeSinceExpiration / (24 * 60 * 60 * 1000));
            }
            
            return isValid;
            
        } catch (JwtException e) {
            log.error("Erreur lors de la vérification du token pour rafraîchissement: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (JwtException e) {
            log.error("Erreur lors de la vérification de l'expiration du token: {}", e.getMessage());
            return true;
        }
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
        } catch (ExpiredJwtException e) {
            log.warn("Token expiré: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            log.error("Token malformé: {}", e.getMessage());
            throw e;
        } catch (SecurityException e) {
            log.error("Erreur de sécurité lors du parsing du token: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            log.error("Token vide ou null: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur inattendue lors de l'extraction des claims du token: {}", e.getMessage());
            throw new JwtException("Erreur lors du traitement du token", e);
        }
    }
    
    /**
     * Extrait les claims d'un token en ignorant son expiration
     * Utile pour rafraîchir les tokens expirés
     */
    private Claims extractAllClaimsIgnoringExpiration(String token) {
        try {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey())
                    .setAllowedClockSkewSeconds(60 * 60 * 24 * 7) // Permettre 7 jours de décalage
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            // En mode "ignore expiration", on retourne quand même les claims
            log.debug("Token expiré mais claims extraits pour rafraîchissement");
            return e.getClaims();
        } catch (MalformedJwtException e) {
            log.error("Token malformé: {}", e.getMessage());
            throw e;
        } catch (SecurityException e) {
            log.error("Erreur de sécurité lors du parsing du token: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            log.error("Token vide ou null: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur inattendue lors de l'extraction des claims (mode expiration ignorée): {}", e.getMessage());
            throw new JwtException("Erreur lors du traitement du token", e);
        }
    }

    private Key getSignInKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            log.error("Erreur lors de la génération de la clé de signature JWT: {}", e.getMessage());
            throw new RuntimeException("Erreur de configuration JWT", e);
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
    
    /**
     * Vérifie si le token a été manipulé ou corrompu
     */
    public boolean isTokenSignatureValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            log.warn("Signature du token invalide: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Renouvelle un token expiré si possible
     */
    public String renewExpiredToken(String expiredToken, Client client) {
        try {
            // Vérifier si le token expiré peut être rafraîchi
            if (!isTokenValidForRefresh(expiredToken, client)) {
                throw new JwtException("Token trop vieux pour être rafraîchi");
            }
            
            // Extraire les claims de l'ancien token
            Claims oldClaims = extractAllClaimsIgnoringExpiration(expiredToken);
            
            // Générer un nouveau token avec les mêmes claims mais une nouvelle date d'expiration
            Map<String, Object> newClaims = new HashMap<>();
            newClaims.put("userId", oldClaims.get("userId"));
            newClaims.put("role", oldClaims.get("role"));
            newClaims.put("nom", oldClaims.get("nom"));
            newClaims.put("prenom", oldClaims.get("prenom"));
            newClaims.put("clientType", oldClaims.get("clientType"));
            
            return generateToken(newClaims, client);
            
        } catch (Exception e) {
            log.error("Erreur lors du renouvellement du token: {}", e.getMessage());
            throw new JwtException("Impossible de renouveler le token", e);
        }
    }
}