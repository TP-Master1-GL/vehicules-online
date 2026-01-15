# 🧪 Guide de Test des Parcours Utilisateur - Véhicules Online

## 📋 Prérequis

### Démarrage du Backend
```bash
cd backend
java -jar target/vehicules-online-backend-1.0.0.jar --spring.profiles.active=h2 --server.port=9090
```

### Démarrage du Frontend
```bash
cd zamba-auto-frontend
npm run dev -- --port 3000
```

### Accès Frontend
- **URL**: http://localhost:3000

### API Backend
- **Base URL**: http://localhost:9090/api
- **Context Path**: `/api`

---

## 🔐 Parcours 1: Inscription et Connexion

### 1.1 Inscription (Register)

**Endpoint**: `POST /api/auth/register`

```bash
curl -X POST http://localhost:9090/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "password": "SecurePass123!",
    "customer_type": "individual"
  }'
```

**Réponse attendue**: 
```json
{
  "token": "eyJhbGc...",
  "type": "Bearer",
  "id": 1,
  "email": "jean.dupont@example.com",
  "roles": ["ROLE_USER"]
}
```

### 1.2 Connexion (Login)

**Endpoint**: `POST /api/auth/login`

```bash
curl -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "SecurePass123!"
  }'
```

**Réponse attendue**: Token JWT

---

## 🚗 Parcours 2: Parcourir le Catalogue

### 2.1 Récupérer le Catalogue

**Endpoint**: `GET /api/catalogue`

```bash
curl http://localhost:9090/api/catalogue \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Réponse attendue**: Liste de véhicules avec:
- ID
- Modèle
- Type (Automobile/Scooter)
- Énergie (Essence/Électrique)
- Prix
- Stock

### 2.2 Détail d'un Véhicule

**Endpoint**: `GET /api/catalogue/{id}`

```bash
curl http://localhost:9090/api/catalogue/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🛒 Parcours 3: Gérer le Panier

### 3.1 Ajouter un Véhicule au Panier

**Endpoint**: `POST /api/panier/ajouter`

```bash
curl -X POST http://localhost:9090/api/panier/ajouter \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "vehicule_id": 1,
    "quantite": 1,
    "options": [2, 3]
  }'
```

### 3.2 Consulter le Panier

**Endpoint**: `GET /api/panier`

```bash
curl http://localhost:9090/api/panier \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.3 Supprimer un Article du Panier

**Endpoint**: `DELETE /api/panier/supprimer/{ligne_id}`

```bash
curl -X DELETE http://localhost:9090/api/panier/supprimer/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.4 Vider le Panier

**Endpoint**: `POST /api/panier/vider`

```bash
curl -X POST http://localhost:9090/api/panier/vider \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 Parcours 4: Créer une Commande

### 4.1 Créer une Commande

**Endpoint**: `POST /api/commandes`

```bash
curl -X POST http://localhost:9090/api/commandes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "client_id": 1,
    "type_paiement": "COMPTANT",
    "vehicule_ids": [1, 2],
    "pays_livraison": "FR"
  }'
```

**Réponse**: Commande créée avec:
- ID
- Statut
- Montant total
- Taxes calculées
- Méthode de paiement

### 4.2 Récupérer les Commandes de l'Utilisateur

**Endpoint**: `GET /api/commandes/mes-commandes`

```bash
curl http://localhost:9090/api/commandes/mes-commandes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📄 Parcours 5: Générer des Documents

### 5.1 Générer Documents (PDF/HTML)

**Endpoint**: `POST /api/documents/generate`

```bash
curl -X POST http://localhost:9090/api/documents/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "commande_id": 1,
    "format": "PDF",
    "types": ["IMMATRICULATION", "CESSION", "BON_COMMANDE"]
  }'
```

---

## 💼 Parcours 6: Gestion des Sociétés (B2B)

### 6.1 Créer une Entreprise

**Endpoint**: `POST /api/societe/register`

```bash
curl -X POST http://localhost:9090/api/societe/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "AutoCorp SARL",
    "email": "contact@autocorp.fr",
    "siret": "12345678901234",
    "raison_sociale": "AutoCorp",
    "telephone": "+33123456789",
    "adresse": "Paris, France"
  }'
```

### 6.2 Ajouter une Filiale

**Endpoint**: `POST /api/societe/{societe_id}/filiales`

```bash
curl -X POST http://localhost:9090/api/societe/1/filiales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nom": "AutoCorp Filiale Paris",
    "adresse": "12 Rue de la Paix, 75000 Paris"
  }'
```

---

## ✅ Checklist de Vérification

- [ ] **Inscription**: Nouvel utilisateur créé avec succès
- [ ] **Connexion**: Token JWT obtenu
- [ ] **Catalogue**: Véhicules visibles
- [ ] **Détail Véhicule**: Informations complètes
- [ ] **Panier**: Ajout/suppression de véhicules
- [ ] **Commande**: Création réussie
- [ ] **Documents**: Génération PDF/HTML
- [ ] **Calcul Taxes**: Correct selon pays
- [ ] **Entreprise**: Création et filiales
- [ ] **Dashboard Manager**: Statistiques affichées

---

## 🛠️ Points d'Intégration Frontend-Backend

### Endpoints Critiques (CORS activé)

```
POST   /api/auth/register          ✅
POST   /api/auth/login             ✅
GET    /api/catalogue              ✅
GET    /api/catalogue/{id}         ✅
POST   /api/panier/ajouter         ✅
GET    /api/panier                 ✅
DELETE /api/panier/supprimer/{id}  ✅
POST   /api/commandes              ✅
GET    /api/commandes/mes-commandes ✅
POST   /api/documents/generate     ✅
POST   /api/societe/register       ✅
```

---

## 🔧 Dépannage

### Issue: 403 Forbidden
**Cause**: Token manquant ou invalide
**Solution**: Vérifier le token JWT dans l'en-tête `Authorization: Bearer <token>`

### Issue: Port déjà utilisé
**Cause**: Port 9090 occupé
**Solution**: Changer le port avec `--server.port=XXXX`

### Issue: CORS Error
**Cause**: Frontend sur port 3000, Backend sur 9090
**Solution**: CORS est configuré pour accepter http://localhost:3000

### Issue: Base de données vide
**Cause**: H2 en mémoire réinitialisée au démarrage
**Solution**: Les données sont créées au démarrage via `schema-h2.sql`

---

## 📊 Variables d'Environnement Recommandées

```bash
JAVA_OPTS="-Xmx512m -Xms256m"
DATABASE_DRIVER=org.h2.Driver
DATABASE_URL=jdbc:h2:mem:testdb
JWT_SECRET=your-secret-key-min-32-chars
```

---

## 🔐 Données de Test Prédéfinies

### Utilisateurs
- Email: `user@example.com` / Mot de passe: `Password123!`
- Email: `manager@example.com` / Mot de passe: `Password123!`
- Email: `admin@example.com` / Mot de passe: `Password123!`

### Véhicules
- ID 1: Peugeot 3008 Essence (45000€)
- ID 2: Tesla Model 3 Électrique (55000€)
- ID 3: Vespa Essence (4000€)
- ID 4: Tazzari Zero Électrique (8000€)

---

## 📚 Design Patterns Utilisés

| Endpoint | Pattern |
|----------|---------|
| `/catalogue` | Iterator Pattern |
| `/panier` | Command + Memento |
| `/commandes` | Factory Method + Template Method |
| `/documents/generate` | Builder + Adapter |
| `/societe` | Composite Pattern |
| Formulaires | Bridge Pattern |

