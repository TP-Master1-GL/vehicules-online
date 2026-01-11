package com.vehicules.entities;

import com.vehicules.patterns.command.AppliquerSoldeCommand;
import com.vehicules.patterns.command.AppliquerSoldeGroupeCommand;
import com.vehicules.patterns.command.GestionnaireCommandes;
import com.vehicules.patterns.command.SoldeCommand;

import java.util.List;

public class ServiceSoldes {

    private List<Vehicule> vehicules;
    private GestionnaireCommandes gestionnaire;

    public ServiceSoldes(List<Vehicule> vehicules) {
        this.vehicules = vehicules;
        this.gestionnaire = new GestionnaireCommandes();
    }

    public void appliquerSolde(Vehicule vehicule, double pourcentage) {
        SoldeCommand command = new AppliquerSoldeCommand(vehicule, pourcentage);
        gestionnaire.executeCommand(command);
    }

    public void appliquerSoldeGroupe(List<Vehicule> vehicules, double pourcentage) {
        SoldeCommand command = new AppliquerSoldeGroupeCommand(vehicules, pourcentage);
        gestionnaire.executeCommand(command);
    }

    public void annulerDernierSolde() {
        gestionnaire.undo();
    }

    public List<SoldeCommand> getHistorique() {
        return gestionnaire.getHistory();
    }
}
