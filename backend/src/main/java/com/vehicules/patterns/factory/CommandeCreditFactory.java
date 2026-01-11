package com.vehicules.patterns.factory;

import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.CommandeCredit;

import java.math.BigDecimal;

public class CommandeCreditFactory implements CommandeFactory {
    
    private final double tauxInteret;
    private final int dureeMois;
    
    public CommandeCreditFactory(double tauxInteret, int dureeMois) {
        this.tauxInteret = tauxInteret;
        this.dureeMois = dureeMois;
    }
    
    @Override
    public Commande creerCommande(Client client) {
        CommandeCredit commande = new CommandeCredit();
        commande.setClient(client);
        commande.setTauxInteret(new BigDecimal(tauxInteret));
        commande.setDureeMois(dureeMois);
        commande.setOrganismeCredit("Banque Standard");
        return commande;
    }
}