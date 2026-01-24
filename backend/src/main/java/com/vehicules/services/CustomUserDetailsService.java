package com.vehicules.services;

import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.ClientParticulier;
import com.vehicules.core.entities.Societe;
import com.vehicules.repositories.ClientRepository;
import com.vehicules.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + email));

        // Récupérer le mot de passe et les informations selon le type de client
        String password = "";
        boolean enabled = true;
        String role = "USER";

        if (client instanceof ClientParticulier) {
            ClientParticulier cp = (ClientParticulier) client;
            password = cp.getPassword();
            enabled = cp.getEnabled() != null ? cp.getEnabled() : true;
            role = cp.getRole() != null ? cp.getRole().name() : "USER";
        } else if (client instanceof Societe) {
            Societe societe = (Societe) client;
            password = societe.getPassword();
            enabled = true; // Les sociétés sont toujours activées par défaut
            role = "USER"; // Les sociétés ont le rôle USER par défaut
        }

        return new CustomUserDetails(client, password, enabled, role);
    }
}