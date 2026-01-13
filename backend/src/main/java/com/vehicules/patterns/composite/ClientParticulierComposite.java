package com.vehicules.patterns.composite;

public class ClientParticulierComposite implements ClientComponent {
    private String nom;
    private String email;
    private double totalCommandes;
    
    public ClientParticulierComposite(String nom, String email, double totalCommandes) {
        this.nom = nom;
        this.email = email;
        this.totalCommandes = totalCommandes;
    }
    
    @Override
    public String getNom() {
        return nom;
    }
    
    @Override
    public double getMontantCommandes() {
        return totalCommandes;
    }
    
    @Override
    public void afficher() {
        System.out.println("Particulier: " + nom + " - Total commandes: " + totalCommandes + "€");
    }
}