package com.vehicules.patterns.factory;

import com.vehicules.entities.*;

//Est une Intercafe/classe abstraite

public abstract class CommandeFactory {

    public static Commande createCommande(String type) {

        if ("COMPTANT".equalsIgnoreCase(type)) {
            return new CommandeComptant();
        }

        if ("CREDIT".equalsIgnoreCase(type)) {
            return new CommandeCredit();
        }

        throw new IllegalArgumentException("Type de commande inconnu");
    }
}
//import com.vehicules.core.entities.Client;
//import com.vehicules.core.entities.Commande;
//
//public interface CommandeFactory {
//    Commande creerCommande(Client client);
//}
