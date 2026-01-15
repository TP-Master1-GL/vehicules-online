-- =========================
-- DONNEES DE TEST POUR MYSQL/H2
-- Compatible avec les entités JPA
-- =========================

-- Nettoyage des tables existantes (utilise des suppressions dans le bon ordre)
-- Les suppressions sont gérées par Hibernate avec ddl-auto=create-drop

-- Clients
INSERT INTO client (nom, email, telephone, adresse, dtype) VALUES
('Tsabeng Delphan', 'delphan@example.com', '+237123456789', 'Yaoundé, Cameroun', 'Particulier'),
('AUTO-CORP', 'contact@autocorp.com', '+237987654321', 'Douala, Cameroun', 'Societe');

-- Particulier
INSERT INTO client_particulier (id, prenom, numero_permis, password, role, enabled) VALUES
(1, 'Delphan', 'PERMIS123456', '$2a$10$example.hash', 'USER', true);

-- Société
INSERT INTO societe (id, numero_siret) VALUES
(2, '12345678901234');

-- Filiales
INSERT INTO filiale (localisation, societe_id) VALUES
('Yaoundé', 2),
('Douala', 2);

-- Options de véhicules
INSERT INTO option_vehicule (nom, description, prix, obligatoire) VALUES
('Sièges sport', 'Sièges sportifs confortables', 50000.00, false),
('Sièges cuir', 'Sièges en cuir véritable', 80000.00, false),
('Toit ouvrant', 'Toit ouvrant électrique', 30000.00, false);

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
INSERT INTO commande (date_creation, statut, montant_total, pays_livraison, client_id, dtype) VALUES
('2024-01-15 10:00:00', 'VALIDEE', 8500000.00, 'FR', 1, 'CommandeComptant'),
('2024-02-20 14:30:00', 'EN_COURS', 1800000.00, 'BE', 2, 'CommandeCredit');

-- Lignes de commande
INSERT INTO ligne_commande (quantite, prix_unitaire, prix_total, commande_id, vehicule_id) VALUES
(1, 8500000.00, 8500000.00, 1, 1),
(1, 1800000.00, 1800000.00, 2, 2);
