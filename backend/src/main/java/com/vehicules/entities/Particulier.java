package com.vehicules.entities;

import jakarta.persistence.Entity;

@Entity
public class Particulier extends Client {

    private String prenom;

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
}
