# 🚗 API Routes - Véhicules Online

## 📋 Vue d'ensemble
Toutes les routes sont préfixées par `/api` dans le frontend grâce au proxy Vite.

## 🔐 Authentification (`/auth`)
| Méthode | Route | Description | Corps/Paramètres |
|---------|-------|-------------|------------------|
| POST | `/auth/register` | Inscription utilisateur | `{nom, prenom, email, password, telephone, numeroPermis, adresse}` |
| POST | `/auth/login` | Connexion utilisateur | `{email, password}` |
| POST | `/auth/refresh` | Rafraîchir token | `{refreshToken}` |

## 🛒 Catalogue (`/catalogue`)
| Méthode | Route | Description | Pattern Implémenté |
|---------|-------|-------------|-------------------|
| GET | `/catalogue/une-ligne` | Catalogue 1 ligne/véhicule | Iterator + Decorator + Observer |
| GET | `/catalogue/trois-lignes` | Catalogue 3 lignes/véhicule | Iterator + Decorator + Observer |
| GET | `/catalogue/soldes` | Véhicules soldés | Command Pattern |
| GET | `/catalogue/{id}` | Détails véhicule | - |

## 🛍️ Paniers (`/panier`)
| Méthode | Route | Description | Pattern Implémenté |
|---------|-------|-------------|-------------------|
| POST | `/panier/ajouter` | Ajouter au panier | Command Pattern |
| DELETE | `/panier/retirer/{vehiculeId}` | Retirer du panier | Command Pattern |
| GET | `/panier` | Contenu du panier | - |

## 📋 Commandes (`/commandes`)
| Méthode | Route | Description | Pattern Implémenté |
|---------|-------|-------------|-------------------|
| POST | `/commandes` | Créer commande | Factory Method + Template Method |
| GET | `/commandes/{id}` | Détails commande | - |
| GET | `/commandes/client/{clientId}` | Commandes client | - |
| PUT | `/commandes/{id}/statut` | Modifier statut | - |
| POST | `/commandes/{id}/valider` | Valider commande | - |
| POST | `/commandes/solder-vehicule/{vehiculeId}` | Appliquer solde | Command Pattern |
| GET | `/commandes/stats/{clientId}` | Stats commandes | - |

## 📄 Documents PDF (`/pdf`)
| Méthode | Route | Description | Pattern Implémenté |
|---------|-------|-------------|-------------------|
| POST | `/pdf/generate` | Générer PDF | Builder Pattern + Adapter |
| GET | `/pdf/download/{commandeId}/{type}` | Télécharger PDF | Adapter Pattern |
| GET | `/pdf/liasse/{commandeId}` | Liasse complète | Builder Pattern |
| GET | `/pdf/preview/{commandeId}/{type}` | Aperçu PDF | Adapter Pattern |

## 📝 Formulaires (`/forms`)
| Méthode | Route | Description | Pattern Implémenté |
|---------|-------|-------------|-------------------|
| GET | `/forms/vehicule` | Formulaire véhicule | Bridge Pattern |
| GET | `/forms/commande` | Formulaire commande | Bridge Pattern |
| POST | `/forms/vehicule/submit` | Soumettre formulaire véhicule | Bridge Pattern |
| POST | `/forms/commande/submit` | Soumettre formulaire commande | Bridge Pattern |

## 👨‍💼 Gestion (`/manager`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/manager/dashboard` | Tableau de bord |
| GET | `/manager/vehicules` | Gestion véhicules |
| POST | `/manager/vehicules` | Créer véhicule |
| PUT | `/manager/vehicules/{id}` | Modifier véhicule |
| DELETE | `/manager/vehicules/{id}` | Supprimer véhicule |
| GET | `/manager/commandes/pending` | Commandes en attente |
| PUT | `/manager/commandes/{id}/valider` | Valider commande |
| PUT | `/manager/commandes/{id}/rejeter` | Rejeter commande |
| GET | `/manager/reports/ventes-mensuelles` | Rapport ventes |

## 👑 Administration (`/admin`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/admin/utilisateurs` | Liste utilisateurs |
| POST | `/admin/utilisateurs` | Créer utilisateur |
| PUT | `/admin/utilisateurs/{id}/role` | Modifier rôle |
| PUT | `/admin/utilisateurs/{id}/desactiver` | Désactiver utilisateur |
| GET | `/admin/configurations` | Configurations système |
| PUT | `/admin/configurations/{key}` | Modifier configuration |
| GET | `/admin/health-detailed` | Santé système détaillée |
| GET | `/admin/metrics` | Métriques système |
| POST | `/admin/database/backup` | Sauvegarde base de données |
| POST | `/admin/database/optimize` | Optimisation base de données |

## 🧪 Tests (`/test`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/test` | Test de fonctionnement |
| GET | `/test/hello` | Message de test |

## 🎯 Patterns Implémentés selon l'Énoncé

### 1. Abstract Factory
- **Localisation**: `patterns/abstractfactory/`
- **Usage**: Construction des objets domaine (AutomobileEssence, ScooterElectrique, etc.)
- **Routes concernées**: Catalogue, création véhicules

### 2. Builder
- **Localisation**: `patterns/builder/`
- **Usage**: Construction des liasses de documents
- **Routes concernées**: `/pdf/liasse/{commandeId}`, `/pdf/generate`

### 3. Factory Method
- **Localisation**: `patterns/factory/`
- **Usage**: Création des commandes (Comptant/Crédit)
- **Routes concernées**: `POST /commandes`

### 4. Singleton
- **Localisation**: `patterns/singleton/`
- **Usage**: Liasse vierge de documents
- **Routes concernées**: Initialisation documents PDF

### 5. Adapter
- **Localisation**: `patterns/adapter/`
- **Usage**: Génération de documents PDF
- **Routes concernées**: Toutes les routes `/pdf/*`

### 6. Bridge
- **Localisation**: `patterns/bridge/`
- **Usage**: Formulaires HTML/widgets
- **Routes concernées**: Toutes les routes `/forms/*`

### 7. Composite
- **Localisation**: `patterns/composite/`
- **Usage**: Structure société-filiales
- **Routes concernées**: Gestion clients société

### 8. Decorator + Observer
- **Localisation**: `patterns/decorator/`, `patterns/observer/`
- **Usage**: Affichage catalogue avec décorations et notifications
- **Routes concernées**: Toutes les routes `/catalogue/*`

### 9. Iterator
- **Localisation**: `patterns/iterator/`
- **Usage**: Parcours séquentiel du catalogue (1/3 lignes)
- **Routes concernées**: `/catalogue/une-ligne`, `/catalogue/trois-lignes`

### 10. Template Method
- **Localisation**: `patterns/template/`
- **Usage**: Calcul des taxes selon le pays de livraison
- **Routes concernées**: `POST /commandes` (calcul automatique)

### 11. Command
- **Localisation**: `patterns/command/`
- **Usage**: Application des soldes avec undo
- **Routes concernées**: `/commandes/solder-vehicule/{vehiculeId}`, panier

## 🔧 Configuration Frontend

Le frontend utilise un proxy Vite qui redirige toutes les requêtes `/api/*` vers `http://localhost:8080`.

### Services API créés :
- `auth.js` - Authentification
- `vehicules.js` - Catalogue, commandes, panier, PDF
- `admin.js` - Administration
- `manager.js` - Gestion

### Utilisation dans les composants React :
```javascript
import vehiculesService from '../api/vehicules'

// Exemple d'utilisation
const vehicules = await vehiculesService.getCatalogueUneLigne()
const commande = await vehiculesService.creerCommande(commandeData)
```

## 🚀 Démarrage

1. **Backend**: `./run.sh`
2. **Frontend**: `./start-frontend.sh`
3. **Base MySQL**: Créer `vehicule_db` au préalable

## 📊 URLs Importantes
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Base MySQL**: vehicule_db@localhost:3306
