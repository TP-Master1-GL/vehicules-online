package com.vehicules.patterns.factory;

import com.vehicules.core.entities.Client;
import com.vehicules.core.entities.Commande;

public interface CommandeFactory {
    Commande creerCommande(Client client);
}