package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;

/**
 * Interface Iterator pour le pattern Iterator
 * Utilisé pour parcourir le catalogue de véhicules
 */
public interface CatalogueIterator {

    /**
     * Vérifie s'il y a un élément suivant
     */
    boolean hasNext();

    /**
     * Retourne l'élément suivant
     */
    Vehicule next();

    /**
     * Retourne l'élément courant sans avancer
     */
    Vehicule currentItem();
}
