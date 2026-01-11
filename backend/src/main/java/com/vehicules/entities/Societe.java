package com.vehicules.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;

import java.util.List;

@Entity
@Getter

public class Societe extends Client{

    private String raisonSociale;

    private String siret;

    private String adresse;

    @OneToMany
    List<Filiale> filiales;

    public Societe(String nom, String email, String telephone, List<Commande> commandes, String siret, String raisonSociale, List<Filiale> filiales, String adresse) {
        super(nom, email, telephone, commandes);
        this.siret = siret;
        this.raisonSociale = raisonSociale;
        this.filiales = filiales;
        this.adresse = adresse;
    }

    public Societe() {

    }

    public void ajouterFiliale(Filiale filiale){
        filiales.add(filiale);
    }


    public double calculerTotalFiliales(){
        return filiales.stream()
                .mapToDouble(Filiale::getMontantCommandes)
                .sum();
    }

    public double getMontantTotalCommandes(){
        return calculerTotalAchats() + calculerTotalFiliales();
    }

    public double getMontantCommandes(){
        return getMontantTotalCommandes();
    }
}
