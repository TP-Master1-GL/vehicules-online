package com.vehicules.patterns.iterator;

import com.vehicules.core.entities.Vehicule;
import java.util.List;

public class Catalogue {
    private List<Vehicule> vehicules;
    
    public Catalogue(List<Vehicule> vehicules) {
        this.vehicules = vehicules;
    }
    
    public CatalogueIterator createUneLigneIterator() {
        return new UneLigneIterator(vehicules);
    }
    
    public CatalogueIterator createTroisLignesIterator() {
        return new TroisLignesIterator(vehicules);
    }
    
    public List<Vehicule> getVehicules() {
        return vehicules;
    }
}