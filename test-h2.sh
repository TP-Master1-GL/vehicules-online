#!/bin/bash

# Script de test rapide pour vérifier que l'application démarre avec H2
echo "🧪 Test de démarrage avec H2..."

cd backend

echo "📦 Vérification du JAR..."
if [ ! -f "target/vehicules-online-backend-1.0.0.jar" ]; then
    echo "❌ JAR non trouvé, compilation nécessaire..."
    mvn clean package -Dmaven.test.skip=true -q
fi

echo "🚀 Démarrage de l'application (timeout 25s)..."
timeout 25s java -jar target/vehicules-online-backend-1.0.0.jar --spring.profiles.active=h2 2>&1 | grep -E "(Started VehiculesApplication|Tomcat started|ERROR|Application run failed)" &
PID=$!

echo "⏳ Attente de 20 secondes pour l'initialisation..."
sleep 20

echo "🔍 Test de l'API..."
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Application opérationnelle !"
    echo "🌐 URLs disponibles :"
    echo "   - API: http://localhost:8080"
    echo "   - Swagger: http://localhost:8080/swagger-ui.html"
    echo "   - H2 Console: http://localhost:8080/h2-console"
    echo "   - Health Check: http://localhost:8080/actuator/health"
    kill $PID 2>/dev/null
    echo "🛑 Application arrêtée"
    exit 0
else
    echo "❌ Application non accessible"
    kill $PID 2>/dev/null
    exit 1
fi
