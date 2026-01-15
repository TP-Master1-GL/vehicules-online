package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;
import java.util.List;

public class VehiculeCatalogueIterator implements CatalogueIterator {

    private final List<Vehicule> vehicules;
    private int index = 0;

    public VehiculeCatalogueIterator(List<Vehicule> vehicules, int pageSize) {
        this.vehicules = vehicules;
    }

    @Override
    public boolean hasNext() {
        return index < vehicules.size();
    }

    @Override
    public Vehicule next() {
        if (!hasNext()) {
            throw new IllegalStateException("Plus d'éléments dans l'itérateur");
        }
        return vehicules.get(index++);
    }

    @Override
    public void reset() {
        index = 0;
    }
}
