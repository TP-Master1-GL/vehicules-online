package com.vehicules.patterns.builder;

import java.util.ArrayList;
import java.util.List;

public class PdfBuilder implements DocumentBuilder {
    private List<String> documents = new ArrayList<>();
    
    @Override
    public void ajouterDemandeImmatriculation(String contenu) {
        documents.add("[PDF] Demande d'immatriculation: " + contenu);
    }
    
    @Override
    public void ajouterCertificatCession(String contenu) {
        documents.add("[PDF] Certificat de cession: " + contenu);
    }
    
    @Override
    public void ajouterBonCommande(String contenu) {
        documents.add("[PDF] Bon de commande: " + contenu);
    }
    
    @Override
    public List<String> getLiasse() {
        return new ArrayList<>(documents);
    }
}