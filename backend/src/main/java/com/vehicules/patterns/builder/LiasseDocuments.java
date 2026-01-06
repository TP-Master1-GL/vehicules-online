package com.vehicules.patterns.builder;

// Interface commune pour les liasses
public interface LiasseDocuments {
    String getContenu();
    void afficher();
    String getType();
}

// Implémentation PDF
