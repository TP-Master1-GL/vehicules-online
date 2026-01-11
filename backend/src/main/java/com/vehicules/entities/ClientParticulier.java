package com.vehicules.entities;

import com.vehicules.patterns.composite.ClientComponent;
import jakarta.persistence.Entity;


import java.util.List;

@Entity

public class ClientParticulier extends Client
        implements ClientComponent {

    private String adresse;

    private ClientParticulier(String adresse, String nom, String email, String telephone, List<Commande> commandes){
        super(nom, email, telephone, commandes);
        this.adresse = adresse;
    }

    public ClientParticulier() {

    }

    @Override
    public String getNom() {
        return super.getNom();
    }

    @Override
    public String getEmail() {
        return super.getEmail();
    }


    @Override
    public double getMontantCommandes(){
        return calculerTotalAchats();
    }


    public void afficher(){
        System.out.println("Client Particulier : " + this.getNom() + this.getEmail() + this.getTelephone() + getMontantCommandes() );
    }


}
