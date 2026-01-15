# Dockerfile pour le frontend React

# Étape 1: Build de l'application
FROM node:18-alpine as build

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Étape 2: Serveur Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier la configuration nginx personnalisée
COPY ../docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
