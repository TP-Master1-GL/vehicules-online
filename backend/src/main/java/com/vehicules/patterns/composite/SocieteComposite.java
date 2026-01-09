package com.vehicules.patterns.composite;

import java.util.ArrayList;
import java.util.List;

public class SocieteComposite implements ClientComponent {
    private String nom;
    private List<ClientComponent> filiales = new ArrayList<>();
    
    public SocieteComposite(String nom) {
        this.nom = nom;
    }
    
    public void ajouter(ClientComponent component) {
        filiales.add(component);
    }
    
    public void retirer(ClientComponent component) {
        filiales.remove(component);
    }
    
    @Override
    public String getNom() {
        return nom;
    }
    
    @Override
    public double getMontantCommandes() {
        double total = 0;
        for (ClientComponent filiale : filiales) {
            total += filiale.getMontantCommandes();
        }
        return total;
    }
    
    @Override
    public void afficher() {
        System.out.println("Société: " + nom + " - Total commandes: " + getMontantCommandes() + "€");
        for (ClientComponent filiale : filiales) {
            System.out.print("  ");
            filiale.afficher();
        }
    }
}