package com.vehicules.patterns.composite;

import jakarta.persistence.OneToMany;

import java.util.List;

public class SocieteComposite implements ClientComponent {

    @OneToMany
    private List<ClientComponent> membres;


    @Override
    public String getNom() {
        return "Societe Composite";
    }

    @Override
    public double getMontantCommandes() {
        return
                membres.stream()
                        .mapToDouble(ClientComponent::getMontantCommandes)
                        .sum();
    }

    @Override
    public void afficher() {
        System.out.println("SocieteComposite: ");
        for (ClientComponent component : membres) {
            component.afficher();
        }
        System.out.println("Total commandes: "  + getMontantCommandes());

    }

    public void ajouter(ClientComponent client) {
        membres.add(client);
    }

}
