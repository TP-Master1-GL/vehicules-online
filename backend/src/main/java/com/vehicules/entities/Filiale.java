package com.vehicules.entities;

import jakarta.persistence.*;

@Entity
public class Filiale extends Client {

    @ManyToOne(optional = false)
    @JoinColumn(name = "societe_id")
    private Societe societeMere;

    private String localisation;

    public Societe getSocieteMere() {
        return societeMere;
    }

    public void setSocieteMere(Societe societeMere) {
        this.societeMere = societeMere;
    }

    public String getLocalisation() {
        return localisation;
    }

    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }
}
