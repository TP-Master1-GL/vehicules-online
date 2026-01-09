package com.vehicules.services;

import com.vehicules.entities.Client;
import com.vehicules.entities.Commande;
import com.vehicules.entities.LigneCommande;
import com.vehicules.patterns.template.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaxeService {
    
    public double calculerTotalAvecTaxes(Commande commande) {
        if (commande == null) return 0.0;
        
        double sousTotal = 0.0;
        List<LigneCommande> lignes = commande.getLignes();
        if (lignes != null) {
            for (LigneCommande ligne : lignes) {
                sousTotal += ligne.calculerSousTotal();
            }
        }
        
        String pays = "FR"; // À remplacer par: commande.getClient().getPays()
        Client client = commande.getClient();
        
        CalculCommandeTemplate calculateur = createCalculateur(
            sousTotal, 
            pays, 
            client, 
            lignes
        );
        
        return calculateur.calculerTotal();
    }
    
    private CalculCommandeTemplate createCalculateur(double sousTotal, String pays, 
                                                    Client client, List<LigneCommande> lignes) {
        switch (pays.toUpperCase()) {
            case "FR":
                return new CalculCommandeFR(sousTotal, pays, client, lignes);
            case "BE":
                return new CalculCommandeBE(sousTotal, pays, client, lignes);
            case "LU":
                return new CalculCommandeLU(sousTotal, pays, client, lignes);
            default:
                return new CalculCommandeFR(sousTotal, pays, client, lignes);
        }
    }
}