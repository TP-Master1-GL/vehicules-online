-- Création des tables principales
CREATE TABLE IF NOT EXISTS vehicules (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    modele VARCHAR(100) NOT NULL,
    marque VARCHAR(100) NOT NULL,
    prix_base DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date_stock DATE NOT NULL,
    en_solde BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS societes (
    id VARCHAR(36) PRIMARY KEY,
    raison_sociale VARCHAR(255) NOT NULL,
    siret VARCHAR(14) UNIQUE NOT NULL,
    client_id VARCHAR(36) REFERENCES clients(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS filiales (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    societe_id VARCHAR(36) REFERENCES societes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commandes (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) REFERENCES clients(id),
    date_commande DATE NOT NULL,
    etat VARCHAR(20) NOT NULL,
    type_paiement VARCHAR(20) NOT NULL,
    montant_total DECIMAL(10, 2) NOT NULL,
    taxes DECIMAL(10, 2) NOT NULL,
    pays_livraison VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO vehicules (id, type, modele, marque, prix_base, date_stock) VALUES
('v1', 'AUTOMOBILE_ESSENCE', 'Model 3', 'Tesla', 45000.00, '2024-01-15'),
('v2', 'AUTOMOBILE_ELECTRIQUE', 'Leaf', 'Nissan', 32000.00, '2024-02-20'),
('v3', 'SCOOTER_ESSENCE', 'Vespa', 'Piaggio', 8500.00, '2024-03-10'),
('v4', 'SCOOTER_ELECTRIQUE', 'E-Max', 'Niu', 6500.00, '2023-12-01'),
('v5', 'AUTOMOBILE_ESSENCE', 'Clio', 'Renault', 22000.00, '2023-11-15');

INSERT INTO clients (id, type, nom, email) VALUES
('c1', 'PARTICULIER', 'Jean Dupont', 'jean.dupont@email.com'),
('c2', 'SOCIETE', 'AutoCorp SA', 'contact@autocorp.com');

INSERT INTO societes (id, raison_sociale, siret, client_id) VALUES
('s1', 'AutoCorp SA', '12345678901234', 'c2');

INSERT INTO filiales (id, nom, societe_id) VALUES
('f1', 'AutoCorp Lyon', 's1'),
('f2', 'AutoCorp Marseille', 's1');
