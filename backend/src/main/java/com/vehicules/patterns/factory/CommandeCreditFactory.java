package com.vehicules.patterns.factory;

import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.CommandeCredit;

public class CommandeCreditFactory implements CommandeFactory {
    private double tauxInteret;
    private int dureeMois;
    
    public CommandeCreditFactory(double tauxInteret, int dureeMois) {
        this.tauxInteret = tauxInteret;
        this.dureeMois = dureeMois;
    }
    
    @Override
    public Commande creerCommande(Client client) {
        CommandeCredit commande = new CommandeCredit();
        commande.setClient(client);
        commande.setTauxInteret(java.math.BigDecimal.valueOf(tauxInteret));
        commande.setDureeMois(dureeMois);
        return commande;
    }
}