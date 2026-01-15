package com.vehicules.services;

import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.decorator.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class VehicleDisplayService {

    public String afficherAvecDecorations(Vehicule vehicule) {
        // Créer l'affichage de base
        VehicleDisplay display = new BasicVehicleDisplay(vehicule);

        // Ajouter décorateur pour les véhicules en solde
        if (vehicule.getEnSolde() && vehicule.getPourcentageSolde() != null) {
            display = new PromotionDecorator(display, vehicule.getPourcentageSolde().doubleValue());
        }

        // Ajouter décorateur pour les nouveaux véhicules (moins de 30 jours)
        if (vehicule.getDateStock().isAfter(LocalDate.now().minusDays(30))) {
            display = new NewVehicleDecorator(display);
        }

        // Ajouter décorateur pour les options
        if (vehicule.getOptions() != null && !vehicule.getOptions().isEmpty()) {
            display = new OptionsDecorator(display);
        }

        return display.getDisplayText();
    }
}