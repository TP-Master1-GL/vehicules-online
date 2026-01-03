package com.vehicules.services;

import com.vehicules.core.entities.Vehicule;
import com.vehicules.patterns.decorator.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service pour gérer l'affichage décoré des véhicules
 * Utilise le pattern Decorator pour enrichir l'affichage
 */
@Service
@RequiredArgsConstructor
public class VehicleDisplayService {

    /**
     * Génère l'affichage complet d'un véhicule avec tous les décorateurs appropriés
     */
    public String generateDisplayText(Vehicule vehicule) {
        VehicleDisplay display = new BasicVehicleDisplay(vehicule);

        // Appliquer les décorateurs selon l'état du véhicule
        if (vehicule.getEnSolde()) {
            display = new PromotionDecorator(display, vehicule.getPourcentageSolde().doubleValue());
        }

        if (isNewVehicle(vehicule)) {
            display = new NewVehicleDecorator(display);
        }

        if (hasOptions(vehicule)) {
            display = new OptionsDecorator(display);
        }

        return display.getDisplayText();
    }

    /**
     * Vérifie si le véhicule est considéré comme neuf
     */
    private boolean isNewVehicle(Vehicule vehicule) {
        // Considéré comme neuf si datant de moins de 6 mois
        return vehicule.getDateStock().isAfter(java.time.LocalDate.now().minusMonths(6));
    }

    /**
     * Vérifie si le véhicule a des options
     */
    private boolean hasOptions(Vehicule vehicule) {
        return vehicule.getOptions() != null && !vehicule.getOptions().isEmpty();
    }
}
