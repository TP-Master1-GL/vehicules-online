package com.vehicules.services;

import com.vehicules.core.entities.Vehicule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PrixService {

    @Autowired
    private TaxeService taxeService;

    public double calculerPrixFinal(double prixBase, List<String> options, String paysLivraison) {
        double prixAvecOptions = prixBase + calculerPrixOptions(options);
        return taxeService.calculerTotalAvecTaxes(prixAvecOptions, paysLivraison);
    }

    private double calculerPrixOptions(List<String> options) {
        if (options == null) return 0.0;

        return options.stream()
            .mapToDouble(this::getPrixOption)
            .sum();
    }

    private double getPrixOption(String option) {
        return switch (option.toLowerCase()) {
            case "sièges cuir" -> 1500.0;
            case "toit ouvrant" -> 1200.0;
            case "système audio premium" -> 800.0;
            case "jantes alliage" -> 1000.0;
            default -> 500.0;
        };
    }

    public boolean verifierOptionsIncompatibles(List<String> options) {
        if (options == null) return true;

        boolean siegeCuir = options.stream()
            .anyMatch(o -> o.equalsIgnoreCase("sièges cuir"));
        boolean siegeSport = options.stream()
            .anyMatch(o -> o.equalsIgnoreCase("sièges sportifs"));

        return !(siegeCuir && siegeSport);
    }

    public boolean estEligibleSolde(Vehicule vehicule) {
        if (vehicule.getDateStock() == null) return false;

        LocalDate dateStock = vehicule.getDateStock();
        long joursEnStock = ChronoUnit.DAYS.between(dateStock, LocalDate.now());

        return joursEnStock > 180;
    }
}