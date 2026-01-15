package com.vehicules.patterns.abstractfactory;

import com.vehicules.entities.Vehicule;
import com.vehicules.entities.OptionVehicule;

/**
 * Abstract Factory selon le COURS (pages 50-54)
 * Interface avec MULTIPLES méthodes de création → FAMILLES de produits
 * 
 * Rôle : FabriqueAbstraite
 * Produits : Vehicule (ProduitA) + OptionVehicule (ProduitB)
 */
public interface VehiculeFactory {
    
    /**
     * Crée un véhicule (Produit A)
     * @return Véhicule spécifique selon la factory
     */
    Vehicule creerVehicule();
    
    /**
     * Crée une option de performance (Produit B1)
     * Options spécifiques à chaque type de véhicule
     * @return OptionVehicule de performance
     */
    OptionVehicule creerOptionPerformance();
    
    /**
     * Crée une option de confort (Produit B2)
     * Options spécifiques à chaque type de véhicule
     * @return OptionVehicule de confort
     */
    OptionVehicule creerOptionConfort();
    
    /**
     * Crée une option de sécurité (Produit B3)
     * @return OptionVehicule de sécurité
     */
    OptionVehicule creerOptionSecurite();
}