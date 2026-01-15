#!/bin/bash

# Script pour démarrer le frontend React avec Vite
# Utilisation: ./start-frontend.sh

echo "🚀 Démarrage du frontend React"
echo "============================="

cd "$(dirname "$0")/zamba-auto-frontend"

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
fi

echo "✅ Démarrage du serveur Vite..."
npm run dev
