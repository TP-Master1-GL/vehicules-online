-- Création des tables principales (compatibles avec les entités JPA)
CREATE TABLE IF NOT EXISTS vehicule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(255) NOT NULL,
    modele VARCHAR(255) NOT NULL,
    prix_base DECIMAL(10, 2) NOT NULL,
    date_stock DATE NOT NULL,
    en_solde BOOLEAN DEFAULT FALSE,
    pourcentage_solde DECIMAL(5, 2),
    dtype VARCHAR(31) NOT NULL
);

CREATE TABLE IF NOT EXISTS option_vehicule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicule_option (
    vehicule_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    PRIMARY KEY (vehicule_id, option_id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id),
    FOREIGN KEY (option_id) REFERENCES option_vehicule(id)
);

CREATE TABLE IF NOT EXISTS option_vehicule_options_incompatibles (
    option_vehicule_id BIGINT NOT NULL,
    options_incompatibles_id BIGINT NOT NULL,
    PRIMARY KEY (option_vehicule_id, options_incompatibles_id),
    FOREIGN KEY (option_vehicule_id) REFERENCES option_vehicule(id),
    FOREIGN KEY (options_incompatibles_id) REFERENCES option_vehicule(id)
);

CREATE TABLE IF NOT EXISTS client (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    adresse VARCHAR(500),
    dtype VARCHAR(31) NOT NULL
);

CREATE TABLE IF NOT EXISTS particulier (
    id BIGINT PRIMARY KEY,
    prenom VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id) REFERENCES client(id)
);

CREATE TABLE IF NOT EXISTS societe (
    id BIGINT PRIMARY KEY,
    numero_siret VARCHAR(14) UNIQUE,
    FOREIGN KEY (id) REFERENCES client(id)
);

CREATE TABLE IF NOT EXISTS filiale (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    localisation VARCHAR(255),
    societe_id BIGINT,
    FOREIGN KEY (societe_id) REFERENCES societe(id)
);

CREATE TABLE IF NOT EXISTS commande (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_commande VARCHAR(20) NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    client_id BIGINT,
    vehicule_id BIGINT,
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicule(id)
);

-- Insertion de données de test
-- Clients
INSERT INTO client (nom, email, telephone, adresse, dtype) VALUES
('Tsabeng Delphan', 'delphan@example.com', '+237123456789', 'Yaoundé, Cameroun', 'Particulier'),
('AUTO-CORP', 'contact@autocorp.com', '+237987654321', 'Douala, Cameroun', 'Societe');

-- Particulier (id doit correspondre à l'id du client)
INSERT INTO particulier (id, prenom, password, role, enabled) VALUES
(1, 'Delphan', '$2a$10$example.hash', 'USER', true);

-- Société (id doit correspondre à l'id du client)
INSERT INTO societe (id, numero_siret) VALUES
(2, '12345678901234');

-- Filiales
INSERT INTO filiale (localisation, societe_id) VALUES
('Yaoundé', 2),
('Douala', 2);

-- Options de véhicules
INSERT INTO option_vehicule (nom) VALUES
('Sièges sport'),
('Sièges cuir'),
('Toit ouvrant');

-- Incompatibilités d'options
INSERT INTO option_vehicule_options_incompatibles (option_vehicule_id, options_incompatibles_id) VALUES
(1, 2),
(2, 1);

-- Véhicules
INSERT INTO vehicule (marque, modele, prix_base, date_stock, en_solde, dtype) VALUES
('Toyota', 'Corolla', 8500000.00, '2024-01-15', false, 'AutomobileEssence'),
('Yamaha', 'E-Scoot', 1800000.00, '2024-02-20', false, 'ScooterElectrique');

-- Association véhicule-options
INSERT INTO vehicule_option (vehicule_id, option_id) VALUES
(1, 1),
(2, 3);

-- Commandes
INSERT INTO commande (type_commande, montant, client_id, vehicule_id) VALUES
('COMPTANT', 8500000.00, 1, 1),
('CREDIT', 1800000.00, 2, 2);
