-- =========================
-- CLIENTS
-- =========================

-- Client Particulier
INSERT INTO client (id, nom, type_client) VALUES (1, 'Tsabeng Delphan', 'PARTICULIER');
INSERT INTO particulier (id, prenom) VALUES (1, 'Delphan');

-- Société
INSERT INTO client (id, nom, type_client) VALUES (2, 'AUTO-CORP', 'SOCIETE');
INSERT INTO societe (id, numero_siret) VALUES (2, '12345678901234');

-- Filiales de la société AUTO-CORP
INSERT INTO client (id, nom, type_client) VALUES (3, 'AUTO-CORP Yaounde', 'FILIALE');
INSERT INTO filiale (id, societe_id, localisation) VALUES (3, 2, 'Yaounde');

INSERT INTO client (id, nom, type_client) VALUES (4, 'AUTO-CORP Douala', 'FILIALE');
INSERT INTO filiale (id, societe_id, localisation) VALUES (4, 2, 'Douala');

-- =========================
-- OPTIONS VEHICULE
-- =========================

INSERT INTO option_vehicule (id, nom)
VALUES (1, 'Sieges sport');

INSERT INTO option_vehicule (id, nom)
VALUES (2, 'Sieges cuir');

INSERT INTO option_vehicule (id, nom)
VALUES (3, 'Toit ouvrant');

-- Incompatibilités
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

INSERT INTO vehicule_options (vehicule_id, options_id)
VALUES (1, 1);

INSERT INTO vehicule_options (vehicule_id, options_id)
VALUES (2, 3);

-- =========================
-- COMMANDES
-- =========================

INSERT INTO commande
(id, type_commande, montant, client_id, vehicule_id)
VALUES
(1, 'COMPTANT', 8500000, 1, 1);

INSERT INTO commande
(id, type_commande, montant, client_id, vehicule_id)
VALUES
(2, 'CREDIT', 1800000, 2, 2);
