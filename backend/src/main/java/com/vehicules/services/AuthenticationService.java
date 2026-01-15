package com.vehicules.services;

import com.vehicules.api.dto.auth.AuthenticationResponseDTO;
import com.vehicules.api.dto.auth.LoginRequestDTO;
import com.vehicules.api.dto.auth.RegisterRequestDTO;
import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.ClientParticulier;
import com.vehicules.core.entities.Societe;
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
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("L'email est obligatoire");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Le mot de passe doit contenir au moins 6 caractères");
        }
        if (request.getTelephone() == null || request.getTelephone().trim().isEmpty()) {
            throw new IllegalArgumentException("Le téléphone est obligatoire");
        }

        // Pour les particuliers, vérifier prénom et numéro de permis
        if ("individual".equals(request.getCustomerType())) {
            if (request.getPrenom() == null || request.getPrenom().trim().isEmpty()) {
                throw new IllegalArgumentException("Le prénom est obligatoire pour les particuliers");
            }
            if (request.getNumeroPermis() == null || request.getNumeroPermis().trim().isEmpty()) {
                throw new IllegalArgumentException("Le numéro de permis est obligatoire pour les particuliers");
            }
        }

        // Vérifier si l'email existe déjà
        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("L'email est déjà utilisé");
        }

        Client client;

        // Créer le bon type de client selon customerType
        if ("company".equals(request.getCustomerType()) || "professional".equals(request.getCustomerType())) {
            // Pour les entreprises, créer une Société
            Societe societe = new Societe();
            societe.setNom(request.getNom().trim());
            societe.setEmail(request.getEmail().trim().toLowerCase());
            societe.setTelephone(request.getTelephone().trim());
            societe.setAdresse(request.getAdresse() != null && !request.getAdresse().trim().isEmpty()
                ? request.getAdresse().trim()
                : "Adresse non spécifiée");
            societe.setRaisonSociale(request.getNom().trim() + " SARL"); // Valeur par défaut
            societe.setSiret("12345678901234"); // Valeur par défaut, devrait être fourni par le frontend
            client = societe;
        } else {
            // Pour les particuliers, créer un ClientParticulier
            ClientParticulier clientParticulier = new ClientParticulier();
            clientParticulier.setNom(request.getNom().trim());
            clientParticulier.setPrenom(request.getPrenom().trim());
            clientParticulier.setEmail(request.getEmail().trim().toLowerCase());
            clientParticulier.setTelephone(request.getTelephone().trim());
            clientParticulier.setAdresse(request.getAdresse() != null && !request.getAdresse().trim().isEmpty()
                ? request.getAdresse().trim()
                : "Adresse non spécifiée");
            clientParticulier.setNumeroPermis(request.getNumeroPermis().trim());
            clientParticulier.setPassword(passwordEncoder.encode(request.getPassword()));
            clientParticulier.setRole(request.getRole() != null ? request.getRole() : Role.USER);
            client = clientParticulier;
        }

        // Sauvegarder le client
        Client savedClient = clientRepository.save(client);

        // Générer les tokens
        String jwtToken = jwtService.generateToken(savedClient);
        String refreshToken = jwtService.generateRefreshToken(savedClient);

        // Pour les sociétés, prenom sera vide
        String prenom = savedClient.getPrenom();

        return new AuthenticationResponseDTO(
            jwtToken,
            refreshToken,
            savedClient.getEmail(),
            savedClient.getNom(),
            prenom,
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

        // Pour les sociétés, prenom sera vide
        String prenom = client.getPrenom();

        return new AuthenticationResponseDTO(
            jwtToken,
            refreshToken,
            client.getEmail(),
            client.getNom(),
            prenom,
            client.getRole()
        );
    }
}
