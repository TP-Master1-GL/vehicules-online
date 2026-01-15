#!/bin/bash

echo "🚀 Démarrage du backend Véhicules Online avec H2..."

# Aller dans le répertoire backend
cd "$(dirname "$0")/backend"

# Compiler et créer le JAR
echo "📦 Compilation et packaging..."
mvn clean package -q -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la compilation"
    exit 1
fi

# Tuer les processus existants
echo "🛑 Arrêt des processus existants..."
pkill -f "vehicules-online-backend" 2>/dev/null || true
sleep 3

# Démarrer le backend avec H2
echo "🎯 Démarrage du backend avec H2..."
java -jar target/vehicules-online-backend-1.0.0.jar --spring.profiles.active=h2 &

echo "✅ Backend démarré avec succès!"
echo "🌐 API disponible sur: http://localhost:8080"
echo "📖 Swagger UI: http://localhost:8080/swagger-ui.html"
echo "🗄️  H2 Console: http://localhost:8080/h2-console"
echo "   JDBC URL: jdbc:h2:mem:testdb"
echo "   Username: sa"
echo "   Password: (vide)"
