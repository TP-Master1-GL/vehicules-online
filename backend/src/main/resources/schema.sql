-- ============================================
-- SCHEMA COMPLET POUR INHERITANCE JOINED
-- ============================================

-- ÉTAPE 1: DÉSACTIVER LES CONTRAINTES ET NETTOYER
SET FOREIGN_KEY_CHECKS = 0;

-- Supprimer toutes les tables dans le bon ordre
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
DROP TABLE IF EXISTS client_particulier;
DROP TABLE IF EXISTS societe;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS option_vehicule;
DROP TABLE IF EXISTS taxe_pays;
DROP TABLE IF EXISTS document_vierge;

-- ÉTAPE 2: CRÉATION DES TABLES POUR L'HÉRITAGE JOINED

-- 1. TABLE CLIENT (table parent)
CREATE TABLE client (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dtype VARCHAR(31) NOT NULL COMMENT 'ClientParticulier ou Societe',
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    
    INDEX idx_client_nom (nom),
    INDEX idx_client_email (email),
    INDEX idx_client_dtype (dtype)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABLE CLIENT_PARTICULIER (extension de CLIENT)
CREATE TABLE client_particulier (
    client_id BIGINT PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    numero_permis VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    filiale_id BIGINT,
    
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE,
    FOREIGN KEY (filiale_id) REFERENCES filiale(id) ON DELETE SET NULL,
    INDEX idx_cp_prenom (prenom),
    INDEX idx_cp_permis (numero_permis),
    INDEX idx_cp_filiale (filiale_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABLE SOCIETE (extension de CLIENT)
CREATE TABLE societe (
    client_id BIGINT PRIMARY KEY,
    siret VARCHAR(14) UNIQUE NOT NULL,
    raison_sociale VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE,
    INDEX idx_societe_siret (siret),
    INDEX idx_societe_raison (raison_sociale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABLE FILIALE (doit être créée après societe)
CREATE TABLE filiale (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    localisation VARCHAR(100),
    adresse VARCHAR(255),
    societe_id BIGINT NOT NULL,
    
    FOREIGN KEY (societe_id) REFERENCES societe(client_id) ON DELETE CASCADE,
    INDEX idx_filiale_societe (societe_id),
    INDEX idx_filiale_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Mettre à jour la foreign key de client_particulier après création de filiale
ALTER TABLE client_particulier 
ADD CONSTRAINT fk_client_particulier_filiale 
FOREIGN KEY (filiale_id) REFERENCES filiale(id) ON DELETE SET NULL;

-- 6. TABLE OPTION_VEHICULE
CREATE TABLE option_vehicule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) DEFAULT 0.00,
    obligatoire BOOLEAN DEFAULT FALSE,
    UNIQUE KEY uk_option_nom (nom),
    INDEX idx_option_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABLE OPTION_INCOMPATIBLES
CREATE TABLE option_incompatibles (
    option_id_1 BIGINT NOT NULL,
    option_id_2 BIGINT NOT NULL,
    PRIMARY KEY (option_id_1, option_id_2),
    FOREIGN KEY (option_id_1) REFERENCES option_vehicule(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id_2) REFERENCES option_vehicule(id) ON DELETE CASCADE,
    CHECK (option_id_1 < option_id_2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. TABLE VEHICULE
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

-- 9. TABLE VEHICULE_OPTION
CREATE TABLE vehicule_option (
    vehicule_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    PRIMARY KEY (vehicule_id, option_id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES option_vehicule(id) ON DELETE CASCADE,
    INDEX idx_vo_vehicule (vehicule_id),
    INDEX idx_vo_option (option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. TABLE PANIER
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

-- 11. TABLE PANIER_ITEM
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

-- 12. TABLE PANIER_HISTORIQUE
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

-- 13. TABLE COMMANDE
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

-- 14. TABLE LIGNE_COMMANDE
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

-- 15. TABLE COMMANDE_VEHICULE
CREATE TABLE commande_vehicule (
    commande_id BIGINT NOT NULL,
    vehicule_id BIGINT NOT NULL,
    PRIMARY KEY (commande_id, vehicule_id),
    FOREIGN KEY (commande_id) REFERENCES commande(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id) ON DELETE CASCADE,
    INDEX idx_cv_commande (commande_id),
    INDEX idx_cv_vehicule (vehicule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. TABLE DOCUMENT
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

-- 17. TABLE DOCUMENT_VIERGE
CREATE TABLE document_vierge (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_document VARCHAR(50) UNIQUE NOT NULL,
    template_path VARCHAR(255),
    description VARCHAR(255),
    date_mise_a_jour DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dv_type (type_document)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. TABLE TAXE_PAYS
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

-- 19. TABLE SOLDE_HISTORIQUE
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

-- 20. TABLE OPTION_PANIER
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

-- ÉTAPE 3: INSERTION DES DONNÉES POUR L'HÉRITAGE JOINED

-- 1. Insérer d'abord dans client (parent)
INSERT IGNORE INTO client (id, dtype, nom, email, telephone, adresse) VALUES
(1, 'ClientParticulier', 'Dupont', 'jean.dupont@email.com', '+33123456789', '12 Rue de la Paix, 75001 Paris'),
(2, 'ClientParticulier', 'Martin', 'sophie.martin@email.com', '+33698765432', '45 Avenue des Champs, 69002 Lyon'),
(3, 'Societe', 'AutoCorp', 'contact@autocorp.com', '+33199887766', 'Tour Montparnasse, 75015 Paris'),
(4, 'Societe', 'TransportPlus', 'info@transportplus.fr', '+33456789012', 'Pôle d''activités, 31000 Toulouse');

-- 2. Insérer dans societe (enfants)
INSERT IGNORE INTO societe (client_id, siret, raison_sociale, password) VALUES
(3, '12345678901234', 'AutoCorp SAS', '$2a$10$N9qo8uLOickgx2ZMRZoMye1s3L5K.jd7xJhZiDPrG7q8Q6QY8zL1W'),
(4, '98765432109876', 'TransportPlus SA', '$2a$10$N9qo8uLOickgx2ZMRZoMye1s3L5K.jd7xJhZiDPrG7q8Q6QY8zL1W');

-- 3. Insérer dans client_particulier (enfants)
INSERT IGNORE INTO client_particulier (client_id, prenom, numero_permis, password, role, enabled) VALUES
(1, 'Jean', 'PERMIS123456', '$2a$10$N9qo8uLOickgx2ZMRZoMye1s3L5K.jd7xJhZiDPrG7q8Q6QY8zL1W', 'USER', TRUE),
(2, 'Sophie', 'PERMIS789012', '$2a$10$N9qo8uLOickgx2ZMRZoMye1s3L5K.jd7xJhZiDPrG7q8Q6QY8zL1W', 'USER', TRUE);

-- 4. Insérer dans filiale (doit être après societe)
INSERT IGNORE INTO filiale (id, nom, localisation, adresse, societe_id) VALUES
(1, 'Paris Centre', 'Paris', '12 Rue de Rivoli, 75004 Paris', 3),
(2, 'Lyon Part-Dieu', 'Lyon', 'Place Charles Béraudier, 69003 Lyon', 3),
(3, 'Toulouse Centre', 'Toulouse', 'Place du Capitole, 31000 Toulouse', 4);

-- 5. Mettre à jour les client_particulier avec leur filiale
UPDATE client_particulier SET filiale_id = 1 WHERE client_id = 1;
UPDATE client_particulier SET filiale_id = 2 WHERE client_id = 2;

-- 6. OPTIONS VÉHICULE (reste pareil)
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

-- ... (le reste des insertions comme avant) ...

SELECT '========================================' AS '';
SELECT 'SCHEMA JOINED CRÉÉ AVEC SUCCÈS!' AS message;
SELECT '========================================' AS '';
SELECT 'Tables:' AS '', COUNT(*) AS count FROM information_schema.tables WHERE table_schema = DATABASE()
UNION ALL
SELECT 'Clients (parent):', COUNT(*) FROM client
UNION ALL
SELECT 'Particuliers:', COUNT(*) FROM client_particulier
UNION ALL
SELECT 'Sociétés:', COUNT(*) FROM societe
UNION ALL
SELECT 'Filiales:', COUNT(*) FROM filiale;