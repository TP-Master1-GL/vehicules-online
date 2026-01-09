package com.vehicules.patterns.builder;

import java.util.ArrayList;
import java.util.List;

public class HtmlBuilder implements DocumentBuilder {
    private List<String> documents = new ArrayList<>();
    
    @Override
    public void ajouterDemandeImmatriculation(String contenu) {
        documents.add("<html><body><h1>Demande d'immatriculation</h1><p>" + contenu + "</p></body></html>");
    }
    
    @Override
    public void ajouterCertificatCession(String contenu) {
        documents.add("<html><body><h1>Certificat de cession</h1><p>" + contenu + "</p></body></html>");
    }
    
    @Override
    public void ajouterBonCommande(String contenu) {
        documents.add("<html><body><h1>Bon de commande</h1><p>" + contenu + "</p></body></html>");
    }
    
    @Override
    public List<String> getLiasse() {
        return new ArrayList<>(documents);
    }
}