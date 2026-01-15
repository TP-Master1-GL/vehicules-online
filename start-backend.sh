#!/bin/bash

# Script pour démarrer le backend avec H2 pour un développement rapide
# Utilisation: ./start-backend.sh [h2|mysql]

PROFILE=${1:-h2}

echo "🚀 Démarrage du backend avec le profil: $PROFILE"
echo "=========================================="

cd "$(dirname "$0")/backend"

if [ "$PROFILE" = "mysql" ]; then
    echo "⚠️  MySQL mode - assurez-vous que MySQL est running"
    mvn clean spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mysql"
else
    echo "✅ H2 mode - Base de données en mémoire"
    mvn clean spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2"
fi
