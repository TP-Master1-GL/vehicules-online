package com.vehicules.services;

import com.vehicules.patterns.abstractfactory.ElectriqueFactory;
import com.vehicules.patterns.abstractfactory.EssenceFactory;
import com.vehicules.patterns.abstractfactory.VehiculeFactory;
import com.vehicules.core.entities.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class VehiculeFactoryService {
    
    public Vehicule creerVehicule(String type, String energie, String marque, 
                                   String modele, BigDecimal prixBase, Map<String, Object> options) {
        
        System.out.println("🏭 [ABSTRACT FACTORY] Création " + type + " " + energie);
        
        // Sélectionner la factory
        VehiculeFactory factory;
        if ("ESSENCE".equalsIgnoreCase(energie.toUpperCase())) {
            factory = new EssenceFactory();
            System.out.println("   → Factory: EssenceFactory");
        } else if ("ELECTRIQUE".equalsIgnoreCase(energie.toUpperCase())) {
            factory = new ElectriqueFactory();
            System.out.println("   → Factory: ElectriqueFactory");
        } else {
            throw new IllegalArgumentException("Énergie non supportée: " + energie);
        }
        
        // Créer le véhicule
        Vehicule vehicule;
        if ("AUTOMOBILE".equalsIgnoreCase(type.toUpperCase())) {
            vehicule = factory.creerAutomobile(modele, marque, prixBase);
            System.out.println("   → Véhicule: Automobile (" + vehicule.getClass().getSimpleName() + ")");
            configureAutomobile((Automobile) vehicule, options);
        } else if ("SCOOTER".equalsIgnoreCase(type.toUpperCase())) {
            vehicule = factory.creerScooter(modele, marque, prixBase);
            System.out.println("   → Véhicule: Scooter (" + vehicule.getClass().getSimpleName() + ")");
            configureScooter((Scooter) vehicule, options);
        } else {
            throw new IllegalArgumentException("Type non supporté: " + type);
        }
        
        return vehicule;
    }
    
    private void configureAutomobile(Automobile auto, Map<String, Object> options) {
        if (options != null) {
            auto.setCouleur(extractString(options, "couleur", "Blanc"));
            auto.setNombrePortes(extractInteger(options, "nombrePortes", 4));
            auto.setNombrePlaces(extractInteger(options, "nombrePlaces", 5));
            auto.setPuissance(extractInteger(options, "puissance", 100));
            auto.setTransmission(extractString(options, "transmission", "MANUELLE"));
            
            // Configurer les sous-classes
            if (auto instanceof AutomobileEssence) {
                configureAutomobileEssence((AutomobileEssence) auto, options);
            } else if (auto instanceof AutomobileElectrique) {
                configureAutomobileElectrique((AutomobileElectrique) auto, options);
            }
        }
    }
    
    private void configureAutomobileEssence(AutomobileEssence essence, Map<String, Object> options) {
        if (options != null) {
            essence.setConsommation(extractBigDecimal(options, "consommation", BigDecimal.valueOf(6.5)));
            essence.setCarburant(extractString(options, "carburant", "ESSENCE"));
            essence.setAutonomie(extractInteger(options, "autonomie", 600));
        }
    }
    
    private void configureAutomobileElectrique(AutomobileElectrique electrique, Map<String, Object> options) {
        if (options != null) {
            electrique.setAutonomie(extractInteger(options, "autonomie", 300));
            electrique.setTempsChargeRapide(extractInteger(options, "tempsChargeRapide", 30));
            electrique.setTypeChargeur(extractString(options, "typeChargeur", "TYPE2"));
        }
    }
    
    private void configureScooter(Scooter scooter, Map<String, Object> options) {
        if (options != null) {
            scooter.setCouleur(extractString(options, "couleur", "Noir"));
            scooter.setCylindree(extractInteger(options, "cylindree", 125));
            scooter.setCategoriePermis(extractString(options, "categoriePermis", "A1"));
            
            // Configurer les sous-classes
            if (scooter instanceof ScooterEssence) {
                configureScooterEssence((ScooterEssence) scooter, options);
            } else if (scooter instanceof ScooterElectrique) {
                configureScooterElectrique((ScooterElectrique) scooter, options);
            }
        }
    }
    
    private void configureScooterEssence(ScooterEssence essence, Map<String, Object> options) {
        if (options != null) {
            essence.setConsommation(extractBigDecimal(options, "consommation", BigDecimal.valueOf(2.5)));
            essence.setCarburant(extractString(options, "carburant", "ESSENCE"));
            essence.setAutonomie(extractInteger(options, "autonomie", 250));
        }
    }
    
    private void configureScooterElectrique(ScooterElectrique electrique, Map<String, Object> options) {
        if (options != null) {
            electrique.setAutonomie(extractInteger(options, "autonomie", 100));
            electrique.setTempsCharge(extractInteger(options, "tempsCharge", 180));
            electrique.setTypeBatterie(extractString(options, "typeBatterie", "LITHIUM_ION"));
        }
    }
    
    // Méthodes utilitaires d'extraction
    private String extractString(Map<String, Object> options, String key, String defaultValue) {
        if (options != null && options.containsKey(key) && options.get(key) != null) {
            return options.get(key).toString();
        }
        return defaultValue;
    }
    
    private Integer extractInteger(Map<String, Object> options, String key, Integer defaultValue) {
        if (options != null && options.containsKey(key) && options.get(key) != null) {
            Object value = options.get(key);
            if (value instanceof Number) {
                return ((Number) value).intValue();
            } else if (value instanceof String) {
                try {
                    return Integer.parseInt((String) value);
                } catch (NumberFormatException e) {
                    return defaultValue;
                }
            }
        }
        return defaultValue;
    }
    
    private BigDecimal extractBigDecimal(Map<String, Object> options, String key, BigDecimal defaultValue) {
        if (options != null && options.containsKey(key) && options.get(key) != null) {
            Object value = options.get(key);
            if (value instanceof Number) {
                return BigDecimal.valueOf(((Number) value).doubleValue());
            } else if (value instanceof String) {
                try {
                    return new BigDecimal((String) value);
                } catch (NumberFormatException e) {
                    return defaultValue;
                }
            }
        }
        return defaultValue;
    }
}