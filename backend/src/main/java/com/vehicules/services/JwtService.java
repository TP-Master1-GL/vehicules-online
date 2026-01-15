package com.vehicules.services;

import com.vehicules.core.entities.Client;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

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

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(Client client) {
        return generateToken(new HashMap<>(), client);
    }

    public String generateToken(Map<String, Object> extraClaims, Client client) {
        return buildToken(extraClaims, client, jwtExpiration);
    }

    public String generateRefreshToken(Client client) {
        return buildToken(new HashMap<>(), client, refreshExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, Client client, long expiration) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(client.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .claim("role", client.getRole().name())
                .claim("nom", client.getNom())
                .claim("prenom", client.getPrenom())
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

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
