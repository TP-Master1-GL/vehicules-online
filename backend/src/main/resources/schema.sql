-- ============================================
-- SCHEMA COMPLET AVEC DONNÉES
-- ============================================

-- ÉTAPE 1: DÉSACTIVER LES CONTRAINTES ET NETTOYER
SET FOREIGN_KEY_CHECKS = 0;

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
DROP TABLE IF EXISTS commande;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS option_vehicule;
DROP TABLE IF EXISTS taxe_pays;
DROP TABLE IF EXISTS document_vierge;

-- ÉTAPE 2: CRÉATION DES TABLES

-- 1. TABLE CLIENT
CREATE TABLE client (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dtype VARCHAR(31) NOT NULL COMMENT 'Particulier ou Societe',
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    
    -- Colonnes pour Particulier
    prenom VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    
    -- Colonnes pour Societe
    numero_siret VARCHAR(14),
    raison_sociale VARCHAR(100),
    
    INDEX idx_client_nom (nom),
    INDEX idx_client_email (email),
    INDEX idx_client_dtype (dtype)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABLE FILIALE
CREATE TABLE filiale (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    localisation VARCHAR(100),
    adresse VARCHAR(255),
    societe_id BIGINT NOT NULL,
    FOREIGN KEY (societe_id) REFERENCES client(id) ON DELETE CASCADE,
    INDEX idx_filiale_societe (societe_id),
    INDEX idx_filiale_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABLE OPTION_VEHICULE
CREATE TABLE option_vehicule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) DEFAULT 0.00,
    obligatoire BOOLEAN DEFAULT FALSE,
    UNIQUE KEY uk_option_nom (nom),
    INDEX idx_option_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABLE OPTION_INCOMPATIBLES
CREATE TABLE option_incompatibles (
    option_id_1 BIGINT NOT NULL,
    option_id_2 BIGINT NOT NULL,
    PRIMARY KEY (option_id_1, option_id_2),
    FOREIGN KEY (option_id_1) REFERENCES option_vehicule(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id_2) REFERENCES option_vehicule(id) ON DELETE CASCADE,
    CHECK (option_id_1 < option_id_2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABLE VEHICULE
CREATE TABLE vehicule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dtype VARCHAR(31) NOT NULL COMMENT 'AutomobileEssence, AutomobileElectrique, ScooterEssence, ScooterElectrique',
    
    -- Colonnes communes
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    prix_base DECIMAL(10,2) NOT NULL,
    date_stock DATE NOT NULL,
    en_solde BOOLEAN DEFAULT FALSE,
    prix_solde DECIMAL(10,2),
    annee INT,
    
    -- Colonnes pour Automobile
    carburant VARCHAR(20),
    nombre_portes INT,
    consommation DECIMAL(5,2),
    
    -- Colonnes pour Automobile Electrique
    autonomie_km INT,
    temps_charge_heures DECIMAL(4,1),
    
    -- Colonnes pour Scooter
    cylindree INT,
    top_case BOOLEAN DEFAULT FALSE,
    capacite_reservoir DECIMAL(4,2),
    charge_rapide BOOLEAN DEFAULT FALSE,
    
    -- Index
    INDEX idx_vehicule_marque (marque),
    INDEX idx_vehicule_modele (modele),
    INDEX idx_vehicule_prix (prix_base),
    INDEX idx_vehicule_stock (date_stock),
    INDEX idx_vehicule_marque_modele (marque, modele),
    INDEX idx_vehicule_solde (en_solde),
    INDEX idx_vehicule_dtype (dtype)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABLE VEHICULE_OPTION
CREATE TABLE vehicule_option (
    vehicule_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    PRIMARY KEY (vehicule_id, option_id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES option_vehicule(id) ON DELETE CASCADE,
    INDEX idx_vo_vehicule (vehicule_id),
    INDEX idx_vo_option (option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABLE PANIER
CREATE TABLE panier (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    client_id BIGINT NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'ACTIF',
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE,
    INDEX idx_panier_client (client_id),
    INDEX idx_panier_date (date_creation),
    INDEX idx_panier_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABLE PANIER_ITEM
CREATE TABLE panier_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    panier_id BIGINT NOT NULL,
    vehicule_id BIGINT NOT NULL,
    quantite INT DEFAULT 1,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE CASCADE,
    INDEX idx_pi_panier (panier_id),
    INDEX idx_pi_vehicule (vehicule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. TABLE PANIER_HISTORIQUE
CREATE TABLE panier_historique (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    panier_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL COMMENT 'AJOUT, SUPPRESSION, MODIFICATION',
    vehicule_id BIGINT,
    quantite INT,
    date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE SET NULL,
    INDEX idx_ph_panier (panier_id),
    INDEX idx_ph_date (date_action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. TABLE COMMANDE
CREATE TABLE commande (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dtype VARCHAR(31) NOT NULL COMMENT 'CommandeComptant, CommandeCredit',
    
    -- Colonnes communes
    numero VARCHAR(50) UNIQUE NOT NULL,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    client_id BIGINT NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    etat VARCHAR(20) DEFAULT 'EN_COURS' COMMENT 'EN_COURS, VALIDEE, LIVREE',
    type_paiement VARCHAR(30),
    pays_livraison VARCHAR(2) DEFAULT 'FR',
    
    -- Colonnes pour CommandeCredit
    taux_interet DECIMAL(4,2),
    duree_mois INT,
    
    -- Colonnes pour CommandeComptant
    acompte DECIMAL(10,2),
    
    -- Index
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE,
    INDEX idx_commande_client (client_id),
    INDEX idx_commande_date (date_commande),
    INDEX idx_commande_numero (numero),
    INDEX idx_commande_etat (etat),
    INDEX idx_commande_dtype (dtype)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. TABLE LIGNE_COMMANDE
CREATE TABLE ligne_commande (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    commande_id BIGINT NOT NULL,
    vehicule_id BIGINT NOT NULL,
    quantite INT DEFAULT 1,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    sous_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE CASCADE,
    INDEX idx_lc_commande (commande_id),
    INDEX idx_lc_vehicule (vehicule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. TABLE COMMANDE_VEHICULE
CREATE TABLE commande_vehicule (
    commande_id BIGINT NOT NULL,
    vehicule_id BIGINT NOT NULL,
    PRIMARY KEY (commande_id, vehicule_id),
    FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE CASCADE,
    INDEX idx_cv_commande (commande_id),
    INDEX idx_cv_vehicule (vehicule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. TABLE DOCUMENT
CREATE TABLE document (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_document VARCHAR(50) NOT NULL COMMENT 'BON_COMMANDE, DEMANDE_IMMATRICULATION, CERTIFICAT_CESSION',
    contenu TEXT,
    commande_id BIGINT NOT NULL,
    format VARCHAR(10) DEFAULT 'PDF' COMMENT 'PDF, HTML',
    chemin_fichier VARCHAR(255),
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    INDEX idx_document_commande (commande_id),
    INDEX idx_document_type (type_document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. TABLE DOCUMENT_VIERGE
CREATE TABLE document_vierge (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_document VARCHAR(50) UNIQUE NOT NULL,
    template_path VARCHAR(255),
    description VARCHAR(255),
    date_mise_a_jour DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dv_type (type_document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. TABLE TAXE_PAYS
CREATE TABLE taxe_pays (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code_pays VARCHAR(2) UNIQUE NOT NULL,
    nom_pays VARCHAR(50) NOT NULL,
    taux_tva_standard DECIMAL(5,3) NOT NULL,
    taux_tva_reduit DECIMAL(5,3),
    taxe_specifique DECIMAL(5,3) DEFAULT 0.000,
    frais_livraison_base DECIMAL(10,2) DEFAULT 0.00,
    INDEX idx_tp_code (code_pays)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. TABLE SOLDE_HISTORIQUE
CREATE TABLE solde_historique (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicule_id BIGINT NOT NULL,
    pourcentage DECIMAL(5,2) NOT NULL,
    ancien_prix DECIMAL(10,2) NOT NULL,
    nouveau_prix DECIMAL(10,2) NOT NULL,
    date_application DATETIME DEFAULT CURRENT_TIMESTAMP,
    type_solde VARCHAR(20) COMMENT 'PROMOTION, LIQUIDATION',
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE CASCADE,
    INDEX idx_sh_vehicule (vehicule_id),
    INDEX idx_sh_date (date_application)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. TABLE OPTION_PANIER
CREATE TABLE option_panier (
    panier_item_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    PRIMARY KEY (panier_item_id, option_id),
    FOREIGN KEY (panier_item_id) REFERENCES panier_item(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES option_vehicule(id) ON DELETE CASCADE,
    INDEX idx_op_panier_item (panier_item_id),
    INDEX idx_op_option (option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- RÉACTIVER LES CONTRAINTES
SET FOREIGN_KEY_CHECKS = 1;

-- ÉTAPE 3: INSERTION DES DONNÉES

-- 1. OPTIONS VÉHICULE
INSERT IGNORE INTO option_vehicule (id, nom, description, prix, obligatoire) VALUES
(1, 'Sièges sport', 'Sièges baquets sportifs en alcantara', 1200.00, FALSE),
(2, 'Sièges cuir', 'Sièges en cuir véritable massif', 1800.00, FALSE),
(3, 'Toit ouvrant', 'Toit panoramique électrique', 1500.00, FALSE),
(4, 'GPS intégré', 'Navigation écran tactile 10 pouces', 800.00, FALSE),
(5, 'Caméra de recul', 'Aide au stationnement avec détection', 450.00, FALSE),
(6, 'Système audio premium', 'Haut-parleurs Harman Kardon', 950.00, FALSE),
(7, 'Jantes alliage 18"', 'Jantes en alliage léger', 1200.00, FALSE),
(8, 'Peinture métallisée', 'Peinture spéciale effet métal', 750.00, FALSE),
(9, 'Régulateur adaptatif', 'Régulateur de vitesse adaptatif', 1100.00, FALSE),
(10, 'Sièges chauffants', 'Sièges chauffants avant et arrière', 650.00, FALSE);

-- 2. OPTIONS INCOMPATIBLES (IGNORE pour éviter les doublons)
INSERT IGNORE INTO option_incompatibles (option_id_1, option_id_2) VALUES
(1, 2),   -- Sièges sport <> Sièges cuir
(3, 9),   -- Toit ouvrant <> Régulateur adaptatif
(5, 7);   -- Caméra recul <> Jantes alliage

-- 3. CLIENTS
INSERT IGNORE INTO client (id, dtype, nom, email, telephone, adresse, prenom, password, role, enabled) VALUES
(1, 'Particulier', 'Dupont', 'jean.dupont@email.com', '+33123456789', '12 Rue de la Paix, 75001 Paris', 'Jean', '$2a$10$N9qo8uLOickgx2ZMRZoMye1s3L5K.jd7xJhZiDPrG7q8Q6QY8zL1W', 'USER', TRUE),
(2, 'Particulier', 'Martin', 'sophie.martin@email.com', '+33698765432', '45 Avenue des Champs, 69002 Lyon', 'Sophie', '$2a$10$N9qo8uLOickgx2ZMRZoMye1s3L5K.jd7xJhZiDPrG7q8Q6QY8zL1W', 'USER', TRUE),
(3, 'Societe', 'AutoCorp', 'contact@autocorp.com', '+33199887766', 'Tour Montparnasse, 75015 Paris', NULL, NULL, NULL, TRUE),
(4, 'Societe', 'TransportPlus', 'info@transportplus.fr', '+33456789012', 'Pôle d''activités, 31000 Toulouse', NULL, NULL, NULL, TRUE);

-- 4. FILIALES
INSERT IGNORE INTO filiale (id, nom, localisation, adresse, societe_id) VALUES
(1, 'Paris Centre', 'Paris', '12 Rue de Rivoli, 75004 Paris', 3),
(2, 'Lyon Part-Dieu', 'Lyon', 'Place Charles Béraudier, 69003 Lyon', 3),
(3, 'Toulouse Centre', 'Toulouse', 'Place du Capitole, 31000 Toulouse', 4);

-- 5. VÉHICULES
INSERT IGNORE INTO vehicule (id, dtype, marque, modele, prix_base, date_stock, annee, carburant, nombre_portes, consommation, autonomie_km, temps_charge_heures, cylindree, top_case, capacite_reservoir, charge_rapide) VALUES
-- Automobiles Essence
(1, 'AutomobileEssence', 'Toyota', 'Corolla', 22000.00, '2024-01-15', 2023, 'ESSENCE', 5, 5.8, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'AutomobileEssence', 'Renault', 'Clio', 18500.00, '2024-02-10', 2023, 'ESSENCE', 5, 5.2, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'AutomobileEssence', 'Peugeot', '208', 19500.00, '2024-03-05', 2023, 'ESSENCE', 5, 5.5, NULL, NULL, NULL, NULL, NULL, NULL),

-- Automobiles Électriques
(4, 'AutomobileElectrique', 'Tesla', 'Model 3', 42000.00, '2024-01-05', 2023, NULL, NULL, NULL, 450, 8.5, NULL, NULL, NULL, TRUE),
(5, 'AutomobileElectrique', 'Renault', 'Zoe', 32000.00, '2024-02-20', 2023, NULL, NULL, NULL, 395, 9.0, NULL, NULL, NULL, TRUE),
(6, 'AutomobileElectrique', 'Peugeot', 'e-208', 31000.00, '2024-03-12', 2023, NULL, NULL, NULL, 340, 7.5, NULL, NULL, NULL, FALSE),

-- Scooters Essence
(7, 'ScooterEssence', 'Yamaha', 'NMAX', 3500.00, '2024-03-15', 2023, NULL, NULL, NULL, NULL, NULL, 125, FALSE, 6.5, NULL),
(8, 'ScooterEssence', 'Honda', 'PCX', 3800.00, '2024-04-01', 2023, NULL, NULL, NULL, NULL, NULL, 150, TRUE, 8.0, NULL),
(9, 'ScooterEssence', 'Vespa', 'Primavera', 4500.00, '2024-02-28', 2023, NULL, NULL, NULL, NULL, NULL, 125, FALSE, 7.0, NULL),

-- Scooters Électriques
(10, 'ScooterElectrique', 'Niu', 'NQi GT', 3200.00, '2024-03-22', 2023, NULL, NULL, NULL, 85, 4.0, NULL, FALSE, NULL, TRUE),
(11, 'ScooterElectrique', 'Silence', 'S01', 5500.00, '2024-04-05', 2023, NULL, NULL, NULL, 120, 6.0, NULL, TRUE, NULL, TRUE);

-- 6. ASSOCIATIONS VÉHICULE-OPTION
INSERT IGNORE INTO vehicule_option (vehicule_id, option_id) VALUES
-- Toyota Corolla avec options
(1, 1), (1, 3), (1, 5),
-- Tesla Model 3 avec options
(4, 2), (4, 4), (4, 6),
-- Yamaha NMAX avec options
(7, 10),
-- Véhicules en solde
(3, 7), (3, 8),
(9, 10);

-- 7. COMMANDES
INSERT IGNORE INTO commande (id, dtype, numero, date_commande, client_id, montant_total, etat, type_paiement, pays_livraison, taux_interet, duree_mois, acompte) VALUES
-- Commande au comptant
(1, 'CommandeComptant', 'CMD-2024-001', NOW() - INTERVAL 10 DAY, 1, 22000.00, 'VALIDEE', 'CARTE', 'FR', NULL, NULL, 5000.00),
-- Commande avec crédit
(2, 'CommandeCredit', 'CMD-2024-002', NOW() - INTERVAL 5 DAY, 3, 42000.00, 'EN_COURS', 'CREDIT', 'FR', 3.5, 60, NULL),
-- Autre commande
(3, 'CommandeComptant', 'CMD-2024-003', NOW() - INTERVAL 2 DAY, 2, 19500.00, 'EN_COURS', 'VIREMENT', 'BE', NULL, NULL, 3000.00);

-- 8. LIGNES DE COMMANDE
INSERT IGNORE INTO ligne_commande (id, commande_id, vehicule_id, quantite, prix_unitaire, sous_total) VALUES
(1, 1, 1, 1, 22000.00, 22000.00),
(2, 2, 4, 1, 42000.00, 42000.00),
(3, 3, 3, 1, 19500.00, 19500.00);

-- 9. ASSOCIATION COMMANDE-VEHICULE
INSERT IGNORE INTO commande_vehicule (commande_id, vehicule_id) VALUES
(1, 1),
(2, 4),
(3, 3);

-- 10. DOCUMENTS
INSERT IGNORE INTO document (id, type_document, contenu, commande_id, format) VALUES
(1, 'BON_COMMANDE', 'Bon de commande pour Toyota Corolla', 1, 'PDF'),
(2, 'DEMANDE_IMMATRICULATION', 'Demande d''immatriculation 75001', 1, 'PDF'),
(3, 'CERTIFICAT_CESSION', 'Certificat de cession véhicule', 1, 'PDF'),
(4, 'BON_COMMANDE', 'Bon de commande pour Tesla Model 3', 2, 'HTML'),
(5, 'DEMANDE_IMMATRICULATION', 'Demande d''immatriculation société', 2, 'PDF');

-- 11. TAXES PAR PAYS
INSERT IGNORE INTO taxe_pays (id, code_pays, nom_pays, taux_tva_standard, taux_tva_reduit, taxe_specifique, frais_livraison_base) VALUES
(1, 'FR', 'France', 0.200, 0.055, 0.020, 50.00),
(2, 'BE', 'Belgique', 0.210, 0.060, 0.015, 40.00),
(3, 'LU', 'Luxembourg', 0.170, 0.080, 0.010, 60.00),
(4, 'DE', 'Allemagne', 0.190, 0.070, 0.025, 55.00),
(5, 'ES', 'Espagne', 0.210, 0.100, 0.030, 45.00);

-- 12. DOCUMENTS VIERGES
INSERT IGNORE INTO document_vierge (id, type_document, template_path, description) VALUES
(1, 'BON_COMMANDE', '/templates/bon_commande.txt', 'Template standard pour bon de commande'),
(2, 'DEMANDE_IMMATRICULATION', '/templates/demande_immatriculation.txt', 'Template pour demande d''immatriculation'),
(3, 'CERTIFICAT_CESSION', '/templates/certificat_cession.txt', 'Template pour certificat de cession'),
(4, 'FACTURE', '/templates/facture.txt', 'Template pour facture'),
(5, 'CONTRAT_CREDIT', '/templates/contrat_credit.txt', 'Template pour contrat de crédit');

-- 13. SOLDE HISTORIQUE
INSERT IGNORE INTO solde_historique (id, vehicule_id, pourcentage, ancien_prix, nouveau_prix, date_application, type_solde) VALUES
(1, 3, 10.00, 19500.00, 17550.00, NOW() - INTERVAL 15 DAY, 'PROMOTION'),
(2, 9, 15.00, 4500.00, 3825.00, NOW() - INTERVAL 7 DAY, 'LIQUIDATION'),
(3, 2, 5.00, 18500.00, 17575.00, NOW() - INTERVAL 3 DAY, 'PROMOTION');

-- 14. Mise à jour des véhicules en solde
UPDATE vehicule SET en_solde = TRUE, prix_solde = 17550.00 WHERE id = 3;
UPDATE vehicule SET en_solde = TRUE, prix_solde = 3825.00 WHERE id = 9;
UPDATE vehicule SET en_solde = TRUE, prix_solde = 17575.00 WHERE id = 2;

-- ÉTAPE 4: VÉRIFICATION
SELECT '========================================' AS '';
SELECT 'SCHEMA CRÉÉ ET DONNÉES INSÉRÉES AVEC SUCCÈS!' AS message;
SELECT '========================================' AS '';
SELECT 'Tables créées:' AS '', COUNT(*) AS count FROM information_schema.tables WHERE table_schema = DATABASE()
UNION ALL
SELECT 'Clients:', COUNT(*) FROM client
UNION ALL
SELECT 'Véhicules:', COUNT(*) FROM vehicule
UNION ALL
SELECT 'Options:', COUNT(*) FROM option_vehicule
UNION ALL
SELECT 'Incompatibilités:', COUNT(*) FROM option_incompatibles
UNION ALL
SELECT 'Commandes:', COUNT(*) FROM commande
UNION ALL
SELECT 'Documents:', COUNT(*) FROM document;
SELECT '========================================' AS '';