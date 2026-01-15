package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Iterator concret pour afficher 3 véhicules par ligne
 * Pattern: Iterator (Concrete Iterator)
 */
@RequiredArgsConstructor
public class TroisLignesIterator implements CatalogueIterator {

    private final List<Vehicule> vehicules;
    private int position = 0;

    @Override
    public boolean hasNext() {
        return position < vehicules.size();
    }

    @Override
    public Vehicule next() {
        if (!hasNext()) {
            throw new IllegalStateException("Plus d'éléments dans l'itérateur");
        }
        return vehicules.get(position++);
    }

    @Override
    public void reset() {
        position = 0;
    }

    /**
     * Retourne les 3 prochains véhicules pour affichage en grille
     */
    public List<Vehicule> nextThree() {
        int endIndex = Math.min(position + 3, vehicules.size());
        List<Vehicule> nextThree = vehicules.subList(position, endIndex);
        position = endIndex;
        return nextThree;
    }
}
