# Véhicules Online - Système de vente de véhicules

## Description du projet
Application web complète pour la vente de véhicules en ligne avec gestion de catalogue, panier, commandes et documents.

**Implémentation complète des 11 Design Patterns**:
1. **Abstract Factory** - Construction des objets du domaine (automobiles, scooters essence/électrique)
2. **Builder** - Construction des liasses de documents nécessaires
3. **Factory Method** - Création des commandes
4. **Singleton** - Création de la liasse vierge de documents
5. **Adapter** - Génération de documents PDF
6. **Bridge** - Implémentation des formulaires HTML/widgets
7. **Composite** - Représentation des sociétés clientes
8. **Decorator & Observer** - Affichage du catalogue de véhicules
9. **Iterator** - Parcours séquentiel du catalogue
10. **Template Method** - Calcul des montants de commande
11. **Command** - Application des soldes sur les véhicules

## Architecture
- **Backend**: Spring Boot (Java 17) avec JPA/Hibernate
- **Frontend**: React 18 + Vite + TailwindCSS
- **Base de données**:  H2 
- **API**: REST JSON avec OpenAPI/Swagger
- **Sécurité**: JWT + Spring Security
- **Design Patterns**: 11 patterns implémentés selon les spécifications

##  Démarrage Rapide

### Avec H2 

./run-h2.sh
./start-frontend.sh


## URLs d'Accès
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080





