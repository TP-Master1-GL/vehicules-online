#!/bin/bash

# Script de démarrage pour Véhicules Online
# Ce script configure et démarre l'application complète

echo "🚗 Démarrage de Véhicules Online..."

# Vérifier que Java 17+ est installé
if ! command -v java &> /dev/null; then
    echo "❌ Java n'est pas installé. Veuillez installer Java 17 ou supérieur."
    exit 1
fi

# Vérifier la version de Java
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 17 ou supérieur est requis. Version actuelle: $JAVA_VERSION"
    exit 1
fi

echo "✅ Java $JAVA_VERSION détecté"

# Vérifier que Maven est installé
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven n'est pas installé. Veuillez installer Maven."
    exit 1
fi

echo "✅ Maven détecté"

# Vérifier que PostgreSQL est accessible (optionnel pour le développement)
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client détecté"
else
    echo "⚠️  PostgreSQL client non détecté - vérifiez votre configuration de base de données"
fi

# Aller dans le répertoire backend
cd backend

echo "🔨 Compilation du projet..."
if ! mvn clean compile -q; then
    echo "❌ Erreur lors de la compilation"
    exit 1
fi

echo "✅ Compilation réussie"

echo "📦 Construction du package..."
if ! mvn package -DskipTests -q; then
    echo "❌ Erreur lors du packaging"
    exit 1
fi

echo "✅ Package créé avec succès"

echo "🚀 Démarrage de l'application..."
echo "📖 API Documentation disponible sur: http://localhost:8080/swagger-ui.html"
echo "🔄 Base de données: PostgreSQL (vérifiez application.properties)"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter l'application"
echo ""

# Démarrer l'application
mvn spring-boot:run
