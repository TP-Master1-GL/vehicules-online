package com.vehicules.services;

import com.vehicules.core.entities.Societe;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.repositories.SocieteRepository;
import com.vehicules.repositories.CommandeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SocieteService {

    private final SocieteRepository societeRepository;
    private final CommandeRepository commandeRepository;

    /**
     * Récupérer la société par défaut (AUTO-CORP dans les données de test)
     * Si aucune société n'existe, créer une société par défaut
     */
    public Societe getSocieteParDefaut() {
        return societeRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    // Créer une société par défaut si aucune n'existe
                    Societe societeParDefaut = new Societe();
                    societeParDefaut.setNom("AUTO-CORP");
                    societeParDefaut.setEmail("contact@autocorp.com");
                    societeParDefaut.setTelephone("+237987654321");
                    societeParDefaut.setAdresse("Douala, Cameroun");
                    societeParDefaut.setSiret("12345678901234");
                    societeParDefaut.setRaisonSociale("AUTO-CORP SARL");
                    return societeRepository.save(societeParDefaut);
                });
    }

    /**
     * Récupérer les commandes de la société
     */
    public List<Commande> getCommandesSociete(String statut, Integer page, Integer size) {
        // Pour simplifier, on récupère toutes les commandes de type société
        // On ne gère pas encore la pagination pour éviter la complexité
        Class<?> societeClass = Societe.class;
        try {
            if (statut != null) {
                return commandeRepository.findByClientTypeAndStatut(societeClass, statut);
            } else {
                return commandeRepository.findByClientType(societeClass);
            }
        } catch (Exception e) {
            // Si aucune commande n'est trouvée, retourner une liste vide
            return new java.util.ArrayList<>();
        }
    }

    /**
     * Calculer les statistiques de la flotte
     */
    public Map<String, Object> getStatistiquesFlotte() {
        Societe societe = getSocieteParDefaut();
        List<Commande> commandes = getCommandesSociete(null, null, null);

        Map<String, Object> stats = new HashMap<>();

        // Nombre total de véhicules commandés
        int totalVehicules = commandes.stream()
                .mapToInt(cmd -> cmd.getLignes() != null ? cmd.getLignes().size() : 0)
                .sum();

        // Valeur totale des commandes
        BigDecimal totalValue = commandes.stream()
                .map(cmd -> cmd.getMontantTotal() != null ? cmd.getMontantTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Nombre de filiales
        int nombreFiliales = societe.getFiliales() != null ? societe.getFiliales().size() : 0;

        // Commandes par statut
        Map<String, Long> commandesParStatut = commandes.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        cmd -> cmd.getStatut() != null ? cmd.getStatut() : "INCONNU",
                        java.util.stream.Collectors.counting()
                ));

        stats.put("totalVehicules", totalVehicules);
        stats.put("totalValue", totalValue);
        stats.put("nombreFiliales", nombreFiliales);
        stats.put("commandesParStatut", commandesParStatut);
        stats.put("totalCommandes", commandes.size());

        return stats;
    }
}
