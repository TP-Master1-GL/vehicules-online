package com.vehicules.patterns.command;

import com.vehicules.entities.Vehicule;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppliquerSoldeGroupeCommand implements SoldeCommand{

    private List<Vehicule> vehicules;

    private double percentage;

    private Map<Vehicule, Double> anciensPrix = new HashMap<>();

    public AppliquerSoldeGroupeCommand(List<Vehicule> vehicules, double percentage) {
        this.vehicules = vehicules;
        this.percentage = percentage;
    }

    @Override
    public void execute() {
        for (Vehicule vehicule : vehicules) {
            anciensPrix.put(vehicule, percentage);
            vehicule.appliquerSolde(percentage);
        }
    }

    @Override
    public void undo() {
        for (Vehicule vehicule : vehicules) {
            vehicule.annulerSolde();
        }
    }

    @Override
    public String getDescription() {
        return "Solde de groupe de " + percentage + "% sur " + vehicules.size() + " véhicules";
    }
}
