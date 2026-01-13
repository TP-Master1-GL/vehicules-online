package com.vehicules.patterns.command;

import com.vehicules.core.entities.Vehicule;
import java.math.BigDecimal;

public class AppliquerSoldeCommand implements SoldeCommand {
    private Vehicule vehicule;
    private double pourcentage;
    private BigDecimal ancienPrix;

    public AppliquerSoldeCommand(Vehicule vehicule, double pourcentage) {
        this.vehicule = vehicule;
        this.pourcentage = pourcentage;
        this.ancienPrix = vehicule.getPrixBase();
    }

    @Override
    public void execute() {
        BigDecimal nouveauPrix = ancienPrix.multiply(BigDecimal.valueOf(1 - pourcentage / 100));
        vehicule.setPrixBase(nouveauPrix);
        System.out.println("Solde appliqué: " + vehicule.getMarque() + " passe de " +
                          ancienPrix + "€ à " + nouveauPrix + "€");
    }

    @Override
    public void undo() {
        vehicule.setPrixBase(ancienPrix);
        System.out.println("Solde annulé: " + vehicule.getMarque() + " retour à " + ancienPrix + "€");
    }
}