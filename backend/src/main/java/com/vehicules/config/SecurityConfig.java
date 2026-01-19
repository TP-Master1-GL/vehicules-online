package com.vehicules.config;

import com.vehicules.services.CustomUserDetailsService;
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
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
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
        http
            // 1. Désactiver CSRF pour les API REST
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Configurer CORS - Gardez seulement SI vous supprimez WebConfig
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 3. Configurer l'autorisation - ORDRE IMPORTANT !
            .authorizeHttpRequests(authz -> authz
                // Routes ADMIN en PREMIER (ordre spécifique → général)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Routes MANAGER
                .requestMatchers("/api/manager/**").hasAnyRole("ADMIN", "MANAGER")
                
                // Routes authentifiées
                .requestMatchers("/api/commandes/**").authenticated()
                
                // Routes publiques - en DERNIER
                .requestMatchers(
                    "/api/auth/**",
                    "/auth/**",
                    "/api/setup/**",
                    "/api/test/**",
                    "/api/debug/**",
                    "/api/catalogue/**", 
                    "/catalogue/**",
                    "/api/societe/**",
                    "/societe/**",
                    "/api/panier/**",
                    "/panier/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/api-docs/**",
                    "/h2-console/**",
                    "/error",
                    "/favicon.ico",
                    // Static files pour React
                    "/",
                    "/index.html",
                    "/static/**",
                    "/assets/**",
                    "/manifest.json",
                    "/logo192.png",
                    "/logo512.png"
                ).permitAll()
                
                // Pour React Router - permettez les routes frontend
                .requestMatchers(
                    "/login",
                    "/register", 
                    "/catalogue",
                    "/vehicules/**",
                    "/admin/**"
                ).permitAll()
                
                // Toutes les autres API nécessitent auth
                .requestMatchers("/api/**").authenticated()
                
                // Tout le reste (fichiers statiques, React) est permis
                .anyRequest().permitAll()
            )
            
            
            // 4. Session stateless pour JWT
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 5. Ajouter le filtre JWT
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Spécifiez les origines exactes, pas "*" avec allowCredentials
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080"
        ));
        
        // Méthodes autorisées
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"
        ));
        
        // Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "Cache-Control"
        ));
        
        // Headers exposés
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Disposition"
        ));
        
        // Autoriser les credentials
        configuration.setAllowCredentials(true);
        
        // Cache CORS (en secondes)
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