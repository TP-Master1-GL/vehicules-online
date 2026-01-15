-- ============================================
-- SCHEMA COMPLET AVEC DONNÉES POUR H2
-- ============================================

-- ÉTAPE 1: DÉSACTIVER LES CONTRAINTES ET NETTOYER
SET REFERENTIAL_INTEGRITY FALSE;

-- Supprimer toutes les tables dans le bon ordre (enfants d'abord)
DROP TABLE IF EXISTS option_panier;
DROP TABLE IF EXISTS panier_historique;
DROP TABLE IF EXISTS panier_item;
DROP TABLE IF EXISTS option_incompatibles;
DROP TABLE IF EXISTS vehicule_option;
DROP TABLE IF EXISTS ligne_commande;
DROP TABLE IF EXISTS commande_vehicule;
DROP TABLE IF EXISTS document;
DROP TABLE IF EXISTS solde_historique;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS vehicule;
DROP TABLE IF EXISTS filiale;
DROP TABLE IF EXISTS societe;
DROP TABLE IF EXISTS client_particulier;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS option_vehicule;

-- RÉACTIVER LES CONTRAINTES
SET REFERENTIAL_INTEGRITY TRUE;

-- ============================================
-- CRÉATION DES TABLES
-- ============================================

-- Table des options de véhicules
CREATE TABLE option_vehicule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    prix DECIMAL(8, 2) NOT NULL,
    obligatoire BOOLEAN DEFAULT FALSE
);

-- Table des clients (base pour héritage)
CREATE TABLE client (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    adresse VARCHAR(500),
    dtype VARCHAR(31) NOT NULL
);

-- Table des clients particuliers
CREATE TABLE client_particulier (
    id BIGINT PRIMARY KEY,
    prenom VARCHAR(255),
    numero_permis VARCHAR(20),
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    filiale_id BIGINT,
    FOREIGN KEY (id) REFERENCES client(id)
);

-- Table des sociétés
CREATE TABLE societe (
    id BIGINT PRIMARY KEY,
    numero_siret VARCHAR(14) UNIQUE,
    FOREIGN KEY (id) REFERENCES client(id)
);

-- Table des filiales
CREATE TABLE filiale (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    localisation VARCHAR(255),
    societe_id BIGINT,
    FOREIGN KEY (societe_id) REFERENCES societe(id)
);

-- Table des véhicules
CREATE TABLE vehicule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(255) NOT NULL,
    modele VARCHAR(255) NOT NULL,
    prix_base DECIMAL(10, 2) NOT NULL,
    date_stock DATE NOT NULL,
    en_solde BOOLEAN DEFAULT FALSE,
    pourcentage_solde DECIMAL(5, 2),
    dtype VARCHAR(31) NOT NULL
);

-- Table d'association véhicule-option
CREATE TABLE vehicule_option (
    vehicule_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    PRIMARY KEY (vehicule_id, option_id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id),
    FOREIGN KEY (option_id) REFERENCES option_vehicule(id)
);

-- Table des options incompatibles
CREATE TABLE option_incompatibles (
    option1_id BIGINT NOT NULL,
    option2_id BIGINT NOT NULL,
    PRIMARY KEY (option1_id, option2_id),
    FOREIGN KEY (option1_id) REFERENCES option_vehicule(id),
    FOREIGN KEY (option2_id) REFERENCES option_vehicule(id)
);

-- Table des paniers
CREATE TABLE panier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id BIGINT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client(id)
);

-- Table des items du panier
CREATE TABLE panier_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panier_id BIGINT NOT NULL,
    vehicule_id BIGINT NOT NULL,
    quantite INTEGER DEFAULT 1,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panier_id) REFERENCES panier(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
);

-- Table d'historique du panier
CREATE TABLE panier_historique (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panier_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    vehicule_id BIGINT,
    quantite INTEGER,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panier_id) REFERENCES panier(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
);

-- Table des options du panier
CREATE TABLE option_panier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panier_item_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    FOREIGN KEY (panier_item_id) REFERENCES panier_item(id),
    FOREIGN KEY (option_id) REFERENCES option_vehicule(id)
);

-- Table des soldes historiques
CREATE TABLE solde_historique (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicule_id BIGINT NOT NULL,
    ancien_prix DECIMAL(10, 2),
    nouveau_pourcentage DECIMAL(5, 2),
    date_application TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
);

-- Table des commandes
CREATE TABLE commande (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'EN_COURS',
    montant_total DECIMAL(10, 2),
    pays_livraison VARCHAR(100) NOT NULL,
    client_id BIGINT NOT NULL,
    dtype VARCHAR(31) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(id)
);

-- Table des véhicules commandés (pour compatibilité)
CREATE TABLE commande_vehicule (
    commande_id BIGINT NOT NULL,
    vehicule_id BIGINT NOT NULL,
    PRIMARY KEY (commande_id, vehicule_id),
    FOREIGN KEY (commande_id) REFERENCES commande(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
);

-- Table des lignes de commande
CREATE TABLE ligne_commande (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantite INTEGER DEFAULT 1,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    prix_total DECIMAL(10, 2) NOT NULL,
    commande_id BIGINT NOT NULL,
    vehicule_id BIGINT NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commande(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
);

-- Table des documents
CREATE TABLE document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    contenu BLOB,
    format VARCHAR(10) DEFAULT 'PDF',
    commande_id BIGINT,
    FOREIGN KEY (commande_id) REFERENCES commande(id)
);

-- ============================================
-- DONNÉES DE TEST
-- ============================================

-- Options de véhicules
INSERT INTO option_vehicule (nom, description, prix, obligatoire) VALUES
('Sièges sport', 'Sièges sportifs confortables', 50000.00, false),
('Sièges cuir', 'Sièges en cuir véritable', 80000.00, false),
('Toit ouvrant', 'Toit ouvrant électrique', 30000.00, false),
('GPS intégré', 'Système de navigation intégré', 25000.00, false),
('Peinture métallisée', 'Peinture spéciale métallisée', 15000.00, false);

-- Options incompatibles
INSERT INTO option_incompatibles (option1_id, option2_id) VALUES
(1, 2), -- Sièges sport et cuir incompatibles
(2, 1); -- Réciproque

-- Clients
INSERT INTO client (nom, email, telephone, adresse, dtype) VALUES
('Tsabeng Delphan', 'delphan@example.com', '+237123456789', 'Yaoundé, Cameroun', 'Particulier'),
('AUTO-CORP', 'contact@autocorp.com', '+237987654321', 'Douala, Cameroun', 'Societe'),
('Dupont Jean', 'jean.dupont@example.com', '+33123456789', 'Paris, France', 'Particulier');

-- Clients particuliers
INSERT INTO client_particulier (id, prenom, numero_permis, password, role, enabled) VALUES
(1, 'Delphan', 'PERMIS123456', '$2a$10$example.hash', 'USER', true),
(3, 'Jean', 'PERMIS789012', '$2a$10$example.hash2', 'USER', true);

-- Société
INSERT INTO societe (id, numero_siret) VALUES
(2, '12345678901234');

-- Filiales
INSERT INTO filiale (localisation, societe_id) VALUES
('Yaoundé', 2),
('Douala', 2),
('Paris', 2);

-- Véhicules
INSERT INTO vehicule (marque, modele, prix_base, date_stock, en_solde, dtype) VALUES
('Toyota', 'Corolla', 8500000.00, '2024-01-15', false, 'AutomobileEssence'),
('Yamaha', 'E-Scoot', 1800000.00, '2024-02-20', false, 'ScooterElectrique'),
('BMW', 'X3', 45000000.00, '2024-03-10', true, 'AutomobileElectrique'),
('Renault', 'Clio', 12000000.00, '2023-12-01', false, 'AutomobileEssence'),
('Honda', 'CB650R', 9500000.00, '2024-02-15', false, 'ScooterEssence');

-- Association véhicule-options
INSERT INTO vehicule_option (vehicule_id, option_id) VALUES
(1, 1), -- Toyota Corolla - Sièges sport
(1, 3), -- Toyota Corolla - Toit ouvrant
(2, 3), -- Yamaha E-Scoot - Toit ouvrant
(3, 2), -- BMW X3 - Sièges cuir
(3, 4), -- BMW X3 - GPS
(4, 1), -- Renault Clio - Sièges sport
(5, 5); -- Honda CB650R - Peinture métallisée

-- Paniers
INSERT INTO panier (client_id, date_creation) VALUES
(1, CURRENT_TIMESTAMP),
(3, CURRENT_TIMESTAMP);

-- Items du panier
INSERT INTO panier_item (panier_id, vehicule_id, quantite, date_ajout) VALUES
(1, 1, 1, CURRENT_TIMESTAMP),
(1, 2, 1, CURRENT_TIMESTAMP),
(2, 4, 1, CURRENT_TIMESTAMP);

-- Historique du panier
INSERT INTO panier_historique (panier_id, action, vehicule_id, quantite, date_action) VALUES
(1, 'AJOUT', 1, 1, CURRENT_TIMESTAMP),
(1, 'AJOUT', 2, 1, CURRENT_TIMESTAMP),
(2, 'AJOUT', 4, 1, CURRENT_TIMESTAMP);

-- Options du panier
INSERT INTO option_panier (panier_item_id, option_id) VALUES
(1, 1), -- Toyota Corolla - Sièges sport
(3, 1); -- Renault Clio - Sièges sport

-- Soldes
INSERT INTO solde_historique (vehicule_id, ancien_prix, nouveau_pourcentage, date_application) VALUES
(3, 45000000.00, 10.0, CURRENT_TIMESTAMP);

-- Commandes
INSERT INTO commande (date_creation, statut, montant_total, pays_livraison, client_id, dtype) VALUES
(CURRENT_TIMESTAMP, 'VALIDEE', 8500000.00, 'FR', 1, 'CommandeComptant'),
(CURRENT_TIMESTAMP, 'EN_COURS', 1800000.00, 'BE', 2, 'CommandeCredit'),
(CURRENT_TIMESTAMP, 'PAYEE', 12000000.00, 'FR', 3, 'CommandeComptant');

-- Véhicules commandés
INSERT INTO commande_vehicule (commande_id, vehicule_id) VALUES
(1, 1),
(2, 2),
(3, 4);

-- Lignes de commande
INSERT INTO ligne_commande (quantite, prix_unitaire, prix_total, commande_id, vehicule_id) VALUES
(1, 8500000.00, 8500000.00, 1, 1),
(1, 1800000.00, 1800000.00, 2, 2),
(1, 12000000.00, 12000000.00, 3, 4);

-- Documents
INSERT INTO document (type, format, commande_id) VALUES
('FACTURE', 'PDF', 1),
('CERTIFICAT_CESSION', 'PDF', 1),
('BON_COMMANDE', 'PDF', 1),
('FACTURE', 'PDF', 3),
('CERTIFICAT_CESSION', 'PDF', 3),
('BON_COMMANDE', 'PDF', 3);
