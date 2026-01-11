package com.vehicules.patterns.command;

import com.vehicules.entities.Vehicule;

public class AppliquerSoldeCommand implements SoldeCommand {

    private Vehicule vehicule;

    private double percentage;

    private double ancienPrix;

    public AppliquerSoldeCommand(Vehicule vehicule, double ancienPrix) {
        this.vehicule = vehicule;
        this.ancienPrix = ancienPrix;
    }

    @Override
    public void execute() {
        ancienPrix = vehicule.getPrixBase();
        vehicule.appliquerSolde(percentage);
    }

    @Override
    public void undo() {
        vehicule.annulerSolde();
    }

    @Override
    public String getDescription() {
        return "Solde de " + percentage + "% appliquer sur " + vehicule.getMarque() + vehicule.getModele() + vehicule.getModele();
    }
}
