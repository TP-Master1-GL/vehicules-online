#!/bin/bash

echo "📁 Ajout de .gitkeep dans les dossiers vides..."

# Liste des dossiers qui doivent exister
DIRS=(
    "backend/src/main/java/com/vehicules/application"
    "backend/src/main/java/com/vehicules/config"
    "backend/src/main/java/com/vehicules/controllers"
    "backend/src/main/java/com/vehicules/services"
    "backend/src/main/java/com/vehicules/repositories"
    "backend/src/main/java/com/vehicules/entities"
    "backend/src/main/java/com/vehicules/dto"
    "backend/src/main/java/com/vehicules/exceptions"
    "backend/src/main/java/com/vehicules/mappers"
    "backend/src/main/java/com/vehicules/patterns/factory"
    "backend/src/main/java/com/vehicules/patterns/builder"
    "backend/src/main/java/com/vehicules/patterns/adapter"
    "backend/src/main/java/com/vehicules/patterns/bridge"
    "backend/src/main/java/com/vehicules/patterns/composite"
    "backend/src/main/java/com/vehicules/patterns/decorator"
    "backend/src/main/java/com/vehicules/patterns/observer"
    "backend/src/main/java/com/vehicules/patterns/iterator"
    "backend/src/main/java/com/vehicules/patterns/template"
    "backend/src/main/java/com/vehicules/patterns/command"
    "backend/src/main/java/com/vehicules/patterns/singleton"
    "backend/src/main/resources"
    "backend/src/test/java"
    "backend/src/test/resources"
    "frontend/src/components/ui"
    "frontend/src/components/forms"
    "frontend/src/components/vehicules"
    "frontend/src/components/cart"
    "frontend/src/components/common"
    "frontend/src/pages/Home"
    "frontend/src/pages/Catalogue"
    "frontend/src/pages/Cart"
    "frontend/src/pages/Checkout"
    "frontend/src/pages/Profile"
    "frontend/src/pages/Admin"
    "frontend/src/contexts"
    "frontend/src/hooks"
    "frontend/src/layouts"
    "frontend/src/services/api"
    "frontend/src/services/websocket"
    "frontend/src/services/pdf"
    "frontend/src/utils"
    "frontend/src/types"
    "frontend/src/styles"
    "docs/api"
    "docs/architecture"
    "docs/patterns"
    "docker"
    "scripts"
)

# Créer les dossiers et ajouter .gitkeep
for dir in "${DIRS[@]}"; do
    mkdir -p "$dir"
    touch "$dir/.gitkeep"
    echo "✅ Ajouté: $dir/.gitkeep"
done

echo "📝 Création de README pour expliquer la structure..."
cat > backend/src/main/java/com/vehicules/README.md << 'EOF'
# Structure du backend

Ce dossier contient la logique métier de l'application Véhicules Online.

## Organisation
- `application/` : Classe principale Spring Boot
- `config/` : Configurations Spring
- `controllers/` : Contrôleurs REST
- `services/` : Logique métier
- `entities/` : Entités JPA
- `repositories/` : Interfaces de données
- `dto/` : Data Transfer Objects
- `patterns/` : Implémentation des 11 design patterns
