-- =========================
-- CLIENTS
-- =========================

-- Client Particulier
INSERT INTO client (id, nom) VALUES (1, 'Tsabeng Delphan');
INSERT INTO particulier (id) VALUES (1);

-- Société
INSERT INTO client (id, nom) VALUES (2, 'AUTO-CORP');
INSERT INTO societe (id) VALUES (2);

-- Filiales de la société AUTO-CORP
INSERT INTO client (id, nom) VALUES (3, 'AUTO-CORP Yaounde');
INSERT INTO filiale (id, societe_id) VALUES (3, 2);

INSERT INTO client (id, nom) VALUES (4, 'AUTO-CORP Douala');
INSERT INTO filiale (id, societe_id) VALUES (4, 2);

-- =========================
-- OPTIONS VEHICULE
-- =========================

INSERT INTO option_vehicule (id, nom) VALUES (1, 'Sieges sport');
INSERT INTO option_vehicule (id, nom) VALUES (2, 'Sieges cuir');
INSERT INTO option_vehicule (id, nom) VALUES (3, 'Toit ouvrant');

-- Options incompatibles entre elles
INSERT INTO option_vehicule_options_incompatibles 
(option_vehicule_id, options_incompatibles_id)
VALUES (1, 2);

INSERT INTO option_vehicule_options_incompatibles 
(option_vehicule_id, options_incompatibles_id)
VALUES (2, 1);

-- =========================
-- VEHICULES
-- =========================

INSERT INTO vehicule 
(id, type_vehicule, marque, modele, prix_base)
VALUES 
(1, 'AUTOMOBILE_ESSENCE', 'Toyota', 'Corolla', 8500000);

INSERT INTO vehicule 
(id, type_vehicule, marque, modele, prix_base)
VALUES 
(2, 'SCOOTER_ELECTRIQUE', 'Yamaha', 'E-Scoot', 1800000);

-- Association véhicules / options
INSERT INTO vehicule_options (vehicule_id, options_id) VALUES (1, 1);
INSERT INTO vehicule_options (vehicule_id, options_id) VALUES (2, 3);

-- =========================
-- COMMANDES
-- =========================

-- Commande au comptant (particulier)
INSERT INTO commande 
(id, type_commande, montant, client_id, vehicule_id)
VALUES 
(1, 'COMPTANT', 8500000, 1, 1);

-- Commande à crédit (société pour flotte)
INSERT INTO commande 
(id, type_commande, montant, client_id, vehicule_id)
VALUES 
(2, 'CREDIT', 1800000, 2, 2);
