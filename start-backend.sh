#!/bin/bash

# Script de démarrage du backend Vehicules Online

echo "🚀 Démarrage du backend Vehicules Online..."

# Arrêter les processus existants
echo "⏹️  Arrêt des processus existants..."
pkill -f "spring-boot:run" 2>/dev/null
pkill -f "vehicules-online-backend" 2>/dev/null
sleep 2

# Aller dans le répertoire backend
cd "$(dirname "$0")/backend" || exit 1

# Compiler le projet
echo "🔨 Compilation du projet..."
mvn clean compile -q

# Démarrer le backend avec H2
echo "▶️  Démarrage du backend sur le port 8080..."
mvn spring-boot:run -Dspring-boot.run.profiles=h2 -Dserver.port=8080 > backend.log 2>&1 &

# Attendre que le backend démarre
echo "⏳ Attente du démarrage du backend..."
sleep 30

# Tester la connexion
echo "🧪 Test de connexion..."
if curl -s http://localhost:8080/api/test > /dev/null; then
    echo "✅ Backend démarré avec succès sur http://localhost:8080"
    echo ""
    echo "📋 Comptes créés automatiquement :"
    echo "   👤 Admin: admin@vehicules-online.com / admin123"
    echo "   👤 Manager: manager@vehicules-online.com / manager123"
    echo "   👤 User: user@vehicules-online.com / user123"
    echo ""
    echo "📝 Logs disponibles dans: backend/backend.log"
else
    echo "❌ Erreur: Le backend n'a pas démarré correctement"
    echo "📝 Vérifiez les logs dans: backend/backend.log"
    tail -50 backend/backend.log
fi
