package com.vehicules.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // Configuration CORS pour tous les endpoints de l'API
        String[] allowedOrigins = {
            "http://localhost:3000", // React dev server
            "http://localhost:5173", // Vite dev server
            "http://localhost:8080", // Pour les appels directs
            "http://localhost:8081"  // Au cas où
        };

        // Routes principales de l'application
        String[] apiPatterns = {
            "/auth/**",
            "/catalogue/**",
            "/commandes/**",
            "/panier/**",
            "/pdf/**",
            "/forms/**",
            "/manager/**",
            "/admin/**",
            "/societe/**",
            "/test/**"
        };

        for (String pattern : apiPatterns) {
            registry.addMapping(pattern)
                    .allowedOrigins((String[]) java.util.Arrays.stream(allowedOrigins)
                        .filter(origin -> origin != null)
                        .toArray(String[]::new))
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
        }
    }
}
