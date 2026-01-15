package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;

public interface CatalogueIterator {
    boolean hasNext();
    Vehicule next();
    void reset();
}
