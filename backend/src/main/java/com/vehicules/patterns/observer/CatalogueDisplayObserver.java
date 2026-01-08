package com.vehicules.patterns.observer;

import lombok.extern.slf4j.Slf4j;

/**
 * Observateur concret pour l'affichage du catalogue
 * Pattern: Observer (Concrete Observer)
 */
@Slf4j
public class CatalogueDisplayObserver implements CatalogueObserver {

    @Override
    public void update(CatalogueObservable observable) {
        log.info("🔄 Catalogue mis à jour - Actualisation de l'affichage");
        // Ici nous pourrions déclencher un événement WebSocket
        // ou mettre à jour un cache, etc.
        refreshDisplay();
    }

    /**
     * Actualise l'affichage du catalogue
     */
    private void refreshDisplay() {
        log.debug("Actualisation de l'interface d'affichage du catalogue");
        // Logique d'actualisation de l'affichage
        // Par exemple: invalider le cache, envoyer une notification WebSocket, etc.
    }
}
