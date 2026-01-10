package com.vehicules.config;

import com.vehicules.core.entities.ClientParticulier;
import com.vehicules.core.enums.Role;
import com.vehicules.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
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
        if (clientRepository.findAll().stream().noneMatch(c -> c.getRole() == Role.ADMIN)) {
            ClientParticulier admin = new ClientParticulier();
            admin.setNom("Admin");
            admin.setPrenom("System");
            admin.setEmail("admin@vehicules-online.com");
            admin.setTelephone("0000000000");
            admin.setAdresse("123 Admin Street, Admin City");
            admin.setNumeroPermis("ADMIN123456");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);

            clientRepository.save(admin);
            System.out.println("Utilisateur admin créé: admin@vehicules-online.com / admin123");
        }

        // Créer un utilisateur manager par défaut
        if (clientRepository.findAll().stream().noneMatch(c -> c.getRole() == Role.MANAGER)) {
            ClientParticulier manager = new ClientParticulier();
            manager.setNom("Manager");
            manager.setPrenom("Test");
            manager.setEmail("manager@vehicules-online.com");
            manager.setTelephone("1111111111");
            manager.setAdresse("456 Manager Avenue, Manager City");
            manager.setNumeroPermis("MANAGER123456");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setRole(Role.MANAGER);

            clientRepository.save(manager);
            System.out.println("Utilisateur manager créé: manager@vehicules-online.com / manager123");
        }

        // Créer un utilisateur normal par défaut
        if (clientRepository.findAll().stream().noneMatch(c -> c.getRole() == Role.USER)) {
            ClientParticulier user = new ClientParticulier();
            user.setNom("User");
            user.setPrenom("Test");
            user.setEmail("user@vehicules-online.com");
            user.setTelephone("2222222222");
            user.setAdresse("789 User Boulevard, User City");
            user.setNumeroPermis("USER123456");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(Role.USER);

            clientRepository.save(user);
            System.out.println("Utilisateur standard créé: user@vehicules-online.com / user123");
        }
    }
}
