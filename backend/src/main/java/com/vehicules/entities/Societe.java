package com.vehicules.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Societe extends Client {

    @Column(nullable = false, unique = true)
    private String numeroSiret;

    @OneToMany(mappedBy = "societeMere", cascade = CascadeType.ALL)
    private List<Filiale> filiales = new ArrayList<>();

    public String getNumeroSiret() {
        return numeroSiret;
    }

    public void setNumeroSiret(String numeroSiret) {
        this.numeroSiret = numeroSiret;
    }

    public List<Filiale> getFiliales() {
        return filiales;
    }

    public void ajouterFiliale(Filiale filiale) {
        filiales.add(filiale);
        filiale.setSocieteMere(this);
    }
}
