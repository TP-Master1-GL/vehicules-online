package com.vehicules.patterns.singleton;

import java.util.ArrayList;
import java.util.List;

public class LiasseVierge {
    private static LiasseVierge instance;
    private List<String> documents;
    
    private LiasseVierge() {
        documents = new ArrayList<>();
        initialiserDocumentsVierges();
    }
    
    public static synchronized LiasseVierge getInstance() {
        if (instance == null) {
            instance = new LiasseVierge();
        }
        return instance;
    }
    
    private void initialiserDocumentsVierges() {
        documents.add("Demande d'immatriculation [VIERGE]");
        documents.add("Certificat de cession [VIERGE]");
        documents.add("Bon de commande [VIERGE]");
    }
    
    public List<String> getDocuments() {
        return new ArrayList<>(documents);
    }
    
    public void reinitialiser() {
        documents.clear();
        initialiserDocumentsVierges();
    }
}