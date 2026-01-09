// src/main/java/com/vehicules/services/PrixService.java
package com.vehicules.services;

import com.vehicules.entities.Vehicule;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PrixService {
    
    private final TaxeService taxeService;
    
    public PrixService(TaxeService taxeService) {
        this.taxeService = taxeService;
    }
    
    public double calculerPrixFinal(double prixBase, List<String> options, String paysLivraison) {
        double prixAvecOptions = prixBase + calculerPrixOptions(options);
        return taxeService.calculerTotalAvecTaxes(prixAvecOptions, paysLivraison);
    }
    
    private double calculerPrixOptions(List<String> options) {
        // Prix des options selon leur type
        return options.stream()
            .mapToDouble(this::getPrixOption)
            .sum();
    }
    
    private double getPrixOption(String option) {
        // Table de prix des options
        return switch (option) {
            case "sièges cuir" -> 1500.0;
            case "toit ouvrant" -> 1200.0;
            case "système audio premium" -> 800.0;
            case "jantes alliage" -> 1000.0;
            default -> 500.0; // option standard
        };
    }
    
    public double appliquerSolde(Vehicule vehicule, double pourcentage) {
        double ancienPrix = vehicule.getPrixBase();
        double nouveauPrix = ancienPrix * (1 - pourcentage / 100);
        vehicule.setPrixBase(nouveauPrix);
        vehicule.setEnSolde(true);
        return nouveauPrix;
    }
    
    public boolean verifierOptionsIncompatibles(List<String> options) {
        // Vérifie les paires d'options incompatibles
        boolean siegeCuir = options.contains("sièges cuir");
        boolean siegeSport = options.contains("sièges sportifs");
        
        // Sièges cuir et sièges sportifs sont incompatibles
        if (siegeCuir && siegeSport) {
            return false;
        }
        
        // Autres vérifications d'incompatibilité...
        return true;
    }
    
    public boolean estEligibleSolde(Vehicule vehicule) {
        if (vehicule.getDateStock() == null) return false;
        
        LocalDate dateStock = vehicule.getDateStock().toInstant()
            .atZone(java.time.ZoneId.systemDefault())
            .toLocalDate();
        
        long joursEnStock = ChronoUnit.DAYS.between(dateStock, LocalDate.now());
        return joursEnStock > 180; // > 6 mois
    }
}