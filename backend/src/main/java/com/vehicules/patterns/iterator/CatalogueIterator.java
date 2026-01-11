package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;
import java.util.List;

public interface CatalogueIterator {
    boolean hasNext();
    Vehicule next();
    vid reset();
}
