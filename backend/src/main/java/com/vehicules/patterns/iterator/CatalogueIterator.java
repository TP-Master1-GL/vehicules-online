package com.vehicules.patterns.iterator;

import com.vehicules.entities.Vehicule;
import java.util.List;

public interface CatalogueIterator {
    boolean hasNext();
    List<Vehicule> next();
}
