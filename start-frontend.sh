#!/bin/bash

# Script de démarrage du frontend React
echo "🌐 Démarrage du Frontend Zamba Auto..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18 ou supérieur."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 ou supérieur est requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ npm $(npm -v) détecté"

# Aller dans le répertoire frontend
cd zamba-auto-frontend

echo "📦 Installation des dépendances..."
if ! npm install; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"

echo "🚀 Démarrage du serveur de développement..."
echo "🌐 Frontend disponible sur: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8080"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur de développement
npm run dev
