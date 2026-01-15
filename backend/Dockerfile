# Dockerfile pour le backend Spring Boot

# Utiliser une image de base OpenJDK
FROM openjdk:17-jdk-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier JAR généré par Maven
COPY target/*.jar app.jar

# Exposer le port 8080
EXPOSE 8080

# Variables d'environnement
ENV SPRING_PROFILES_ACTIVE=prod

# Commande pour exécuter l'application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
