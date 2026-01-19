package com.vehicules.services;

import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.decorator.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@Transactional(readOnly = true) // ← IMPORTANT : Ajouter l'annotation transactionnelle
public class VehicleDisplayService {

    public String afficherAvecDecorations(Vehicule vehicule) {
        try {
            // Vérifier si les options sont accessibles sans déclencher LazyInitializationException
            boolean hasOptions = false;
            try {
                if (vehicule.getOptions() != null) {
                    // Ne pas utiliser .isEmpty() directement pour éviter le chargement
                    hasOptions = vehicule.getOptions().size() > 0;
                }
            } catch (Exception e) {
                // Si la collection n'est pas initialisée, on considère qu'il n'y a pas d'options
                log.debug("Collection d'options non initialisée pour le véhicule {}", vehicule.getId());
                hasOptions = false;
            }
            
            // Créer l'affichage de base
            VehicleDisplay display = new BasicVehicleDisplay(vehicule);

            // Ajouter décorateur pour les véhicules en solde
            if (vehicule.getEnSolde() != null && vehicule.getEnSolde() && 
                vehicule.getPourcentageSolde() != null) {
                display = new PromotionDecorator(display, vehicule.getPourcentageSolde().doubleValue());
            }

            // Ajouter décorateur pour les nouveaux véhicules (moins de 30 jours)
            if (vehicule.getDateStock() != null && 
                vehicule.getDateStock().isAfter(LocalDate.now().minusDays(30))) {
                display = new NewVehicleDecorator(display);
            }

            // Ajouter décorateur pour les options (uniquement si elles sont accessibles)
            if (hasOptions) {
                display = new OptionsDecorator(display);
            }

            return display.getDisplayText();
        } catch (Exception e) {
            log.error("Erreur lors de l'affichage décoré du véhicule {}", vehicule.getId(), e);
            // Fallback : affichage simple
            return vehicule.getMarque() + " " + vehicule.getModele() + " - " + 
                   vehicule.getPrixFinal() + " FCFA";
        }
    }
}