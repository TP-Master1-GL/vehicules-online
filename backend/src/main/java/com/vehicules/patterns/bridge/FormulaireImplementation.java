package com.vehicules.patterns.bridge;

import java.util.Map;

// Interface d'implémentation
public interface FormulaireImplementation {
    void dessinerChampTexte(String label, String name, String valeur);
    void dessinerChampEmail(String label, String name, String valeur);
    void dessinerChampSelect(String label, String name, Map<String, String> options);
    void dessinerBouton(String texte, String type);
    String getRenduComplet();
    void reset();
}