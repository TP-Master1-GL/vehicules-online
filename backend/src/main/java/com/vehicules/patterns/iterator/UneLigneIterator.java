package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Iterator concret pour afficher 1 véhicule par ligne
 * Pattern: Iterator (Concrete Iterator)
 */
@RequiredArgsConstructor
public class UneLigneIterator implements CatalogueIterator {

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
}
