# 🚗 Véhicules Online - Système de vente de véhicules

## 📋 Description du projet
Application web complète pour la vente de véhicules en ligne avec gestion de catalogue, panier, commandes et documents.

## 🏗️ Architecture
- **Backend**: Spring Boot (Java 17) avec 11 Design Patterns
- **Frontend**: React 18 + TypeScript + Vite
- **Base de données**: PostgreSQL 15
- **API**: REST JSON avec OpenAPI 3
- **Conteneurisation**: Docker + Docker Compose

## 🚀 Installation rapide

### Prérequis
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/vehicules-online.git
cd vehicules-online
2. Démarrer avec Docker (recommandé)
bash
docker-compose up -d
3. Démarrer manuellement
Backend:
bash
cd backend
mvn spring-boot:run
Frontend:
bash
cd frontend
npm install
npm run dev
📁 Structure du projet
text
vehicules-online/
├── backend/                 # Spring Boot Application
│   ├── src/main/java/com/vehicules/
│   │   ├── patterns/       # 11 Design Patterns
│   │   ├── controllers/    # REST Controllers
│   │   ├── services/       # Business Logic
│   │   ├── entities/       # JPA Entities
│   │   └── repositories/   # Data Access
│   └── pom.xml
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/         # Application Pages
│   │   ├── services/      # API Services
│   │   └── contexts/      # React Contexts
│   └── package.json
├── docker/                 # Configuration Docker
├── scripts/               # Scripts utilitaires
└── docs/                  # Documentation
🌐 Accès aux services
Frontend: http://localhost:3000

Backend API: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui.html

PostgreSQL: localhost:5432

PgAdmin: http://localhost:5050

🧪 Tests
bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run e2e
👥 Équipe de développement
Johnny: Architecte full-stack

Laetitia: Documents + UI Frontend

Delphan: Backend Patterns + Data

Ronel: Services métier backend

Audrey: Patterns structurels backend

📅 Délai de livraison
Version préliminaire: 9 janvier 2026

Version finale: 16 janvier 2026

📄 License
MIT
