package com.vehicules.config;

import com.vehicules.core.entities.Client;
import com.vehicules.repositories.ClientRepository;
import com.vehicules.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ClientRepository clientRepository;

    // Liste des chemins publics qui ne nécessitent PAS d'authentification JWT
    private static final List<String> PUBLIC_PATHS = List.of(
        "/api/auth",        // Inscription et connexion
        "/auth",           // Alternative sans /api
        "/api/test",        // Test endpoints
        "/test",            // Alternative
        "/api/catalogue",  // Catalogue public
        "/catalogue",      // Alternative
        "/api/societe",    // Routes société
        "/societe",        // Alternative
        "/api/panier",     // Panier (public pour certaines actions)
        "/panier",         // Alternative
        "/swagger-ui",    // Documentation Swagger
        "/v3/api-docs",    // Spécification OpenAPI
        "/api-docs",      // Docs API
        "/h2-console",    // Console H2
        "/error"            // Pages d'erreur
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String requestPath = request.getServletPath();
        
        // Vérifier si c'est une route publique
        if (isPublicPath(requestPath)) {
            logger.info("Route publique détectée, saut du filtre JWT: " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Pas de token, continuer (le SecurityConfig gérera l'authentification)
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Client client = clientRepository.findByEmail(userEmail).orElse(null);

            if (client != null && jwtService.isTokenValid(jwt, client)) {
                // Créer un UserDetails temporaire pour l'authentification
                org.springframework.security.core.userdetails.User userDetails =
                    new org.springframework.security.core.userdetails.User(
                        client.getEmail(),
                        "", // Pas besoin du mot de passe pour JWT
                        true, true, true, true,
                        java.util.Collections.singletonList(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + client.getRole().name()
                            )
                        )
                    );

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                logger.info("Utilisateur authentifié: " + userEmail);
            }
        }

        filterChain.doFilter(request, response);
    }
    
    // Méthode pour vérifier si le chemin est public
    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }
    
    @Override
    protected boolean shouldNotFilter(@org.springframework.lang.NonNull HttpServletRequest request) throws ServletException {
        return isPublicPath(request.getServletPath());
    }
}