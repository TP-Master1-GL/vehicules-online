package com.vehicules.config;

import com.vehicules.core.entities.Client;
import com.vehicules.repositories.ClientRepository;
import com.vehicules.services.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
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
        "/api/auth/",        // Toutes les routes d'authentification
        "/auth/",           // Alternative sans /api
        "/api/test",        // Test endpoints
        "/test",            // Alternative
        "/api/catalogue",  // Catalogue public
        "/catalogue",      // Alternative
        "/api/societe",    // Routes société
        "/societe",        // Alternative
        "/swagger-ui",    // Documentation Swagger
        "/swagger-ui.html", // Swagger UI page
        "/swagger-ui/**",  // Swagger UI resources
        "/v3/api-docs",    // Spécification OpenAPI
        "/v3/api-docs/**", // OpenAPI docs resources
        "/api-docs",      // Docs API
        "/api-docs/**",   // Docs API resources
        "/h2-console",    // Console H2
        "/h2-console/**", // Console H2 resources
        "/error",         // Pages d'erreur
        "/error/**",      // Error resources
        "/uploads",       // Uploads directory
        "/uploads/**",    // Uploads resources
        "/favicon.ico",   // Favicon
        "/",              // Root
        "/index.html"     // Index
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String requestPath = request.getServletPath();
        final String requestMethod = request.getMethod();
        
        // Vérifier si c'est une route publique
        if (isPublicPath(requestPath)) {
            logger.debug("Route publique détectée, saut du filtre JWT: " + requestMethod + " " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        
        // Gérer les requêtes OPTIONS pour CORS
        if ("OPTIONS".equalsIgnoreCase(requestMethod)) {
            logger.debug("Requête OPTIONS (CORS), saut du filtre JWT: " + requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        
        final String authHeader = request.getHeader("Authorization");
        
        // Vérifier si l'en-tête Authorization est présent pour les routes protégées
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Aucun token JWT trouvé dans l'en-tête Authorization pour: " + requestMethod + " " + requestPath);
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, 
                "Token manquant ou invalide", "L'en-tête Authorization est requis avec un token Bearer");
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);
            
            logger.debug("Token JWT reçu pour l'utilisateur: " + userEmail);

            if (userEmail == null || userEmail.isEmpty()) {
                logger.warn("Impossible d'extraire l'email du token JWT");
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "Token invalide", "Impossible d'extraire les informations d'identification du token");
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                Client client = clientRepository.findByEmail(userEmail).orElse(null);

                if (client == null) {
                    logger.warn("Utilisateur non trouvé dans la base de données: " + userEmail);
                    sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Utilisateur non trouvé", "Les informations d'identification sont invalides");
                    return;
                }

                if (!jwtService.isTokenValid(jwt, client)) {
                    logger.warn("Token JWT invalide pour l'utilisateur: " + userEmail);
                    sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Token invalide", "Le token n'est pas valide pour cet utilisateur");
                    return;
                }

                // Créer un UserDetails temporaire pour l'authentification
                org.springframework.security.core.userdetails.User userDetails =
                    new org.springframework.security.core.userdetails.User(
                        client.getEmail(),
                        "", // Pas besoin du mot de passe pour JWT
                        client.isEnabled(),
                        true, // accountNonExpired
                        true, // credentialsNonExpired
                        true, // accountNonLocked
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
                
                logger.info("Utilisateur authentifié avec succès: " + userEmail + " (" + client.getRole() + ")");
            } else {
                logger.debug("Utilisateur déjà authentifié, saut de l'authentification");
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            logger.warn("Token JWT expiré: " + e.getMessage());
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                "Token expiré", "Votre session a expiré. Veuillez vous reconnecter");
            
        } catch (JwtException e) {
            logger.warn("Erreur lors de la validation du token JWT: " + e.getMessage());
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
                "Token invalide", "Le token fourni n'est pas valide: " + e.getMessage());
            
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de l'authentification JWT: " + e.getMessage(), e);
            sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "Erreur interne", "Une erreur est survenue lors de l'authentification");
        }
    }
    
    // Méthode pour envoyer une réponse d'erreur JSON
    private void sendErrorResponse(HttpServletResponse response, int status, String error, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String jsonResponse = String.format(
            "{\"error\": \"%s\", \"message\": \"%s\", \"timestamp\": \"%s\"}",
            error, message, java.time.LocalDateTime.now().toString()
        );
        
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }
    
    // Méthode pour vérifier si le chemin est public
    private boolean isPublicPath(String path) {
        // Vérifier les chemins exacts
        if (PUBLIC_PATHS.contains(path)) {
            return true;
        }
        
        // Vérifier les chemins qui commencent par un chemin public
        for (String publicPath : PUBLIC_PATHS) {
            if (path.startsWith(publicPath)) {
                return true;
            }
        }
        
        return false;
    }
    
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        String method = request.getMethod();
        
        // Ignorer les requêtes OPTIONS (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            logger.debug("Ignorer filtre pour requête OPTIONS: " + path);
            return true;
        }
        
        boolean isPublic = isPublicPath(path);
        if (isPublic) {
            logger.debug("Chemin public, ignorer filtre: " + method + " " + path);
        }
        return isPublic;
    }
}