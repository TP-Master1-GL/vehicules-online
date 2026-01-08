package com.vehicules.patterns.observer;

/**
 * Interface Observer pour le pattern Observer
 * Utilisée pour réagir aux changements dans le catalogue
 */
public interface CatalogueObserver {

    /**
     * Méthode appelée lorsqu'un changement survient dans le catalogue
     */
    void update(CatalogueObservable observable);
}
