package com.vehicules.config;

import com.vehicules.services.CustomUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("🔐 Configuration de la sécurité en cours...");
        
        http
            // 1. Centralisation du CORS et désactivation CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Gestion des accès (ORDRE CRITIQUE : du plus spécifique au plus général)
            .authorizeHttpRequests(authz -> authz
                // ========== RESSOURCES PUBLIQUES (TRÈS SPÉCIFIQUES - EN PREMIER) ==========
                .requestMatchers(
                    // Authentification
                    "/api/auth/**",
                    
                    // Catalogue public - TOUS LES ENDPOINTS
                    "/api/catalogue",
                    "/api/catalogue/**",
                    
                    // Images
                    "/api/images/**",
                    
                    // Documentation
                    "/swagger-ui/**", 
                    "/v3/api-docs/**",
                    "/api-docs/**",
                    
                    // H2 Console (dev seulement)
                    "/h2-console/**",
                    
                    // Fichiers statiques
                    "/uploads/**",
                    "/static/**",
                    "/favicon.ico",
                    "/error"
                ).permitAll()

                // ========== ADMIN & MANAGER ==========
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")
                
                // ========== APIs AUTHENTIFIÉES SPÉCIFIQUES ==========
                // NOTE: La règle générique "/api/**" plus bas rend déjà ces endpoints authentifiés
                // Pas besoin de les répéter ici
                
                // ========== AUTRES ROUTES PUBLICES ==========
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/login",
                    "/register"
                ).permitAll()
                
                // ========== TOUTES LES AUTRES APIs (GÉNÉRIQUE - EN DERNIER) ==========
                // Cette règle capture TOUS les endpoints /api/ non déjà spécifiés ci-dessus
                .requestMatchers("/api/**").authenticated()
                
                // ========== TOUT LE RESTE ==========
                .anyRequest().permitAll()
            )
            
            // 3. Mode Stateless (JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 4. Authentification
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // 5. Headers de sécurité
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin()) // Pour H2 console
            );

        log.info("✅ Configuration de sécurité terminée");
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Autoriser les origines de développement
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080"
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}