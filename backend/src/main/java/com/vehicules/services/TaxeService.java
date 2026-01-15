package com.vehicules.services;

import org.springframework.stereotype.Service;

@Service
public class TaxeService {

    public double calculerTotalAvecTaxes(double montant, String pays) {
        double tauxTVA;

        switch (pays.toUpperCase()) {
            case "FR":
                tauxTVA = 0.20;
                break;
            case "BE":
                tauxTVA = 0.21;
                break;
            case "LU":
                tauxTVA = 0.17;
                break;
            default:
                tauxTVA = 0.20;
        }

        return montant * (1 + tauxTVA);
    }
}