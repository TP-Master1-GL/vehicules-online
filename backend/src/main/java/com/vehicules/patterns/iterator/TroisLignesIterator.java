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
            return null;
        }
        return vehicules.get(position++);
    }

    @Override
    public Vehicule currentItem() {
        if (position < vehicules.size()) {
            return vehicules.get(position);
        }
        return null;
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
