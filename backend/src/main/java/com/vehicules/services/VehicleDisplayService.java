package com.vehicules.services;

import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.decorator.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@Transactional(readOnly = true)
public class VehicleDisplayService {

    public String afficherAvecDecorations(Vehicule vehicule) {
        if (vehicule == null) {
            log.warn("Tentative d'affichage de véhicule null");
            return "Véhicule non disponible";
        }
        
        try {
            // Vérifier si les options sont accessibles sans déclencher LazyInitializationException
            boolean hasOptions = false;
            try {
                if (vehicule.getOptions() != null && !vehicule.getOptions().isEmpty()) {
                    // Pour éviter LazyInitializationException, on teste avec size() qui ne charge pas tout
                    hasOptions = vehicule.getOptions().size() > 0;
                }
            } catch (Exception e) {
                // Si la collection n'est pas initialisée, on considère qu'il n'y a pas d'options
                log.debug("Collection d'options non initialisée pour le véhicule {}", vehicule.getId());
                hasOptions = false;
            }
            
            // Créer l'affichage de base - PROTÉGÉ contre les véhicules null
            VehicleDisplay display = new BasicVehicleDisplay(vehicule);

            // Ajouter décorateur pour les véhicules en solde
            // Vérification robuste pour éviter NPE
            if (Boolean.TRUE.equals(vehicule.getEnSolde())) {
                Double discountPercentage = null;
                
                try {
                    if (vehicule.getPourcentageSolde() != null) {
                        discountPercentage = vehicule.getPourcentageSolde().doubleValue();
                    }
                } catch (Exception e) {
                    log.warn("Erreur lors de la récupération du pourcentage de solde pour le véhicule {}", 
                             vehicule.getId(), e);
                }
                
                // Si le pourcentage n'est pas disponible, utiliser une valeur par défaut
                if (discountPercentage == null || discountPercentage <= 0) {
                    discountPercentage = 10.0; // Valeur par défaut
                }
                
                try {
                    display = new PromotionDecorator(display, discountPercentage);
                    log.debug("Décorateur promotion ajouté pour le véhicule {} avec {}%", 
                             vehicule.getId(), discountPercentage);
                } catch (Exception e) {
                    log.error("Erreur lors de l'ajout du décorateur promotion pour le véhicule {}", 
                             vehicule.getId(), e);
                }
            }

            // Ajouter décorateur pour les nouveaux véhicules (moins de 30 jours)
            try {
                if (vehicule.getDateStock() != null && 
                    vehicule.getDateStock().isAfter(LocalDate.now().minusDays(30))) {
                    display = new NewVehicleDecorator(display);
                    log.debug("Décorateur 'nouveau' ajouté pour le véhicule {}", vehicule.getId());
                }
            } catch (Exception e) {
                log.warn("Erreur lors de l'ajout du décorateur 'nouveau' pour le véhicule {}", 
                         vehicule.getId(), e);
            }

            // Ajouter décorateur pour les options (uniquement si elles sont accessibles)
            try {
                if (hasOptions) {
                    display = new OptionsDecorator(display);
                    log.debug("Décorateur 'options' ajouté pour le véhicule {}", vehicule.getId());
                }
            } catch (Exception e) {
                log.warn("Erreur lors de l'ajout du décorateur 'options' pour le véhicule {}", 
                         vehicule.getId(), e);
            }
            
            // Ajouter décorateur pour les véhicules populaires (exemple de critère)
            try {
                if (vehicule.getQuantite() != null && vehicule.getQuantite() < 3) {
                    // Si le stock est faible, c'est populaire
                    display = new PopularDecorator(display);
                    log.debug("Décorateur 'populaire' ajouté pour le véhicule {}", vehicule.getId());
                }
            } catch (Exception e) {
                log.warn("Erreur lors de l'ajout du décorateur 'populaire' pour le véhicule {}", 
                         vehicule.getId(), e);
            }

            // Récupérer le texte final avec gestion d'erreur
            try {
                String displayText = display.getDisplayText();
                log.debug("Texte décoré généré pour le véhicule {}: {}", vehicule.getId(), displayText);
                return displayText;
            } catch (Exception e) {
                log.error("Erreur lors de la génération du texte décoré pour le véhicule {}", 
                         vehicule.getId(), e);
                return fallbackDisplayText(vehicule);
            }
            
        } catch (Exception e) {
            log.error("Erreur inattendue lors de l'affichage décoré du véhicule {}", 
                     vehicule.getId(), e);
            return fallbackDisplayText(vehicule);
        }
    }
    
    /**
     * Méthode fallback pour générer un texte d'affichage simple en cas d'erreur
     */
    private String fallbackDisplayText(Vehicule vehicule) {
        try {
            StringBuilder sb = new StringBuilder();
            
            // Marque et modèle
            if (vehicule.getMarque() != null) {
                sb.append(vehicule.getMarque());
            }
            if (vehicule.getModele() != null) {
                sb.append(" ").append(vehicule.getModele());
            }
            
            // Si aucun nom, utiliser un texte générique
            if (sb.length() == 0) {
                sb.append("Véhicule");
            }
            
            // Ajouter le prix s'il est disponible
            if (vehicule.getPrixFinal() != null) {
                sb.append(" - ").append(vehicule.getPrixFinal().intValue()).append(" FCFA");
            }
            
            // Ajouter promotion si applicable
            if (Boolean.TRUE.equals(vehicule.getEnSolde())) {
                sb.append(" ⭐ PROMOTION");
                if (vehicule.getPourcentageSolde() != null) {
                    sb.append(" -").append(vehicule.getPourcentageSolde().intValue()).append("%");
                }
            }
            
            return sb.toString();
            
        } catch (Exception e) {
            log.error("Erreur même dans le fallback pour le véhicule {}", vehicule.getId(), e);
            return "Véhicule disponible";
        }
    }
    
    /**
     * Version alternative qui utilise le constructeur simplifié de PromotionDecorator
     * pour compatibilité avec l'ancien code
     */
    public String afficherAvecDecorationsSimplifie(Vehicule vehicule) {
        if (vehicule == null) {
            return "Véhicule non disponible";
        }
        
        try {
            // Utiliser directement le constructeur simplifié de PromotionDecorator
            if (Boolean.TRUE.equals(vehicule.getEnSolde())) {
                // Ce constructeur gère déjà les vérifications de null
                PromotionDecorator decorator = new PromotionDecorator(vehicule);
                return decorator.getDisplayText();
            } else {
                // Pour les véhicules non en solde, utiliser BasicVehicleDisplay
                BasicVehicleDisplay basicDisplay = new BasicVehicleDisplay(vehicule);
                return basicDisplay.getDisplayText();
            }
        } catch (Exception e) {
            log.error("Erreur dans la version simplifiée pour le véhicule {}", vehicule.getId(), e);
            return fallbackDisplayText(vehicule);
        }
    }
}