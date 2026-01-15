package com.vehicules.patterns.observer;

/**
 * Interface Observable pour le pattern Observer
 * Utilisée pour notifier les changements dans le catalogue
 */
public interface CatalogueObservable {

    /**
     * Ajouter un observateur
     */
    void addObserver(CatalogueObserver observer);

    /**
     * Supprimer un observateur
     */
    void removeObserver(CatalogueObserver observer);

    /**
     * Notifier tous les observateurs
     */
    void notifyObservers();
}
