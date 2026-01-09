package com.vehicules.patterns.factory;

import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.Commande;
import com.vehicules.core.entities.CommandeComptant;

public class CommandeComptantFactory implements CommandeFactory {
    @Override
    public Commande creerCommande(Client client) {
        CommandeComptant commande = new CommandeComptant();
        commande.setClient(client);
        // acompte par défaut à 0
        return commande;
    }
}