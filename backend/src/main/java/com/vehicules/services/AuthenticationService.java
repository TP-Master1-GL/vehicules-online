package com.vehicules.services;

import com.vehicules.api.dto.auth.AuthenticationResponseDTO;
import com.vehicules.api.dto.auth.LoginRequestDTO;
import com.vehicules.api.dto.auth.RegisterRequestDTO;
import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.ClientParticulier;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public AuthenticationResponseDTO register(RegisterRequestDTO request) {
        // Vérifications supplémentaires
        if (request.getNom() == null || request.getNom().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom est obligatoire");
        }
        if (request.getPrenom() == null || request.getPrenom().trim().isEmpty()) {
            throw new IllegalArgumentException("Le prénom est obligatoire");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("L'email est obligatoire");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 6 caractères");
        }
        if (request.getTelephone() == null || request.getTelephone().trim().isEmpty()) {
            throw new IllegalArgumentException("Le téléphone est obligatoire");
        }
        if (request.getNumeroPermis() == null || request.getNumeroPermis().trim().isEmpty()) {
            throw new IllegalArgumentException("Le numéro de permis est obligatoire");
        }

        // Vérifier si l'email existe déjà
        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("L'email est déjà utilisé");
        }

        // Créer un nouveau client
        ClientParticulier client = new ClientParticulier();
        client.setNom(request.getNom().trim());
        client.setPrenom(request.getPrenom().trim());
        client.setEmail(request.getEmail().trim().toLowerCase());
        client.setTelephone(request.getTelephone().trim());
        client.setAdresse(request.getAdresse() != null && !request.getAdresse().trim().isEmpty()
            ? request.getAdresse().trim()
            : "Adresse non spécifiée");
        client.setNumeroPermis(request.getNumeroPermis().trim());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setRole(request.getRole() != null ? request.getRole() : Role.USER);

        // Sauvegarder le client
        Client savedClient = clientRepository.save(client);

        // Générer les tokens
        String jwtToken = jwtService.generateToken(savedClient);
        String refreshToken = jwtService.generateRefreshToken(savedClient);

        return new AuthenticationResponseDTO(
            jwtToken,
            refreshToken,
            savedClient.getEmail(),
            savedClient.getNom(),
            savedClient.getPrenom(),
            savedClient.getRole()
        );
    }

    public AuthenticationResponseDTO authenticate(LoginRequestDTO request) {
        // Authentifier l'utilisateur
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        // Récupérer l'utilisateur
        Client client = clientRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Générer les tokens
        String jwtToken = jwtService.generateToken(client);
        String refreshToken = jwtService.generateRefreshToken(client);

        return new AuthenticationResponseDTO(
            jwtToken,
            refreshToken,
            client.getEmail(),
            client.getNom(),
            client.getPrenom(),
            client.getRole()
        );
    }
}
