package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;
import java.util.List;

public class VehiculeCatalogueIterator implements CatalogueIterator {

    private final List<Vehicule> vehicules;
    private int index = 0;
    private final int pageSize;

    public VehiculeCatalogueIterator(List<Vehicule> vehicules, int pageSize) {
        this.vehicules = vehicules;
        this.pageSize = pageSize;
    }

    @Override
    public boolean hasNext() {
        return index < vehicules.size();
    }

    @Override
    public List<Vehicule> next() {
        int end = Math.min(index + pageSize, vehicules.size());
        List<Vehicule> page = vehicules.subList(index, end);
        index = end;
        return page;
    }
}
