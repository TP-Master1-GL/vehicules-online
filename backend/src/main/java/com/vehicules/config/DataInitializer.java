package com.vehicules.config;

import com.vehicules.core.entities.ClientParticulier;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Créer un utilisateur admin par défaut si aucun admin n'existe
        boolean adminExists = clientRepository.findAll().stream()
            .anyMatch(c -> c.getRole() == Role.ADMIN);
        
        if (!adminExists) {
            try {
                ClientParticulier admin = new ClientParticulier();
                admin.setNom("Admin");
                admin.setPrenom("System");
                admin.setEmail("admin@vehicules-online.com");
                admin.setTelephone("0000000000");
                admin.setAdresse("123 Admin Street, Admin City");
                admin.setNumeroPermis("ADMIN123456");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true); // S'assurer que l'admin est activé

                clientRepository.save(admin);
                System.out.println("✅ Utilisateur admin créé: admin@vehicules-online.com / admin123");
            } catch (Exception e) {
                System.err.println("❌ Erreur lors de la création de l'admin: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("ℹ️  Admin existe déjà dans la base de données");
        }

        // Créer un utilisateur manager par défaut
        boolean managerExists = clientRepository.findAll().stream()
            .anyMatch(c -> c.getRole() == Role.MANAGER);
        
        if (!managerExists) {
            try {
                ClientParticulier manager = new ClientParticulier();
                manager.setNom("Manager");
                manager.setPrenom("Test");
                manager.setEmail("manager@vehicules-online.com");
                manager.setTelephone("1111111111");
                manager.setAdresse("456 Manager Avenue, Manager City");
                manager.setNumeroPermis("MANAGER123456");
                manager.setPassword(passwordEncoder.encode("manager123"));
                manager.setRole(Role.MANAGER);
                manager.setEnabled(true);

                clientRepository.save(manager);
                System.out.println("✅ Utilisateur manager créé: manager@vehicules-online.com / manager123");
            } catch (Exception e) {
                System.err.println("❌ Erreur lors de la création du manager: " + e.getMessage());
            }
        }

        // Créer un utilisateur normal par défaut (optionnel, pour les tests)
        boolean userExists = clientRepository.findAll().stream()
            .anyMatch(c -> c.getRole() == Role.USER && "user@vehicules-online.com".equals(c.getEmail()));
        
        if (!userExists) {
            try {
                ClientParticulier user = new ClientParticulier();
                user.setNom("User");
                user.setPrenom("Test");
                user.setEmail("user@vehicules-online.com");
                user.setTelephone("2222222222");
                user.setAdresse("789 User Boulevard, User City");
                user.setNumeroPermis("USER123456");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole(Role.USER);
                user.setEnabled(true);

                clientRepository.save(user);
                System.out.println("✅ Utilisateur standard créé: user@vehicules-online.com / user123");
            } catch (Exception e) {
                System.err.println("❌ Erreur lors de la création de l'utilisateur: " + e.getMessage());
            }
        }
        
        System.out.println("✅ Initialisation des données terminée");
    }
}
