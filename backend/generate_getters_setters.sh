#!/bin/bash

# Fonction pour générer getters/setters pour une classe
generate_for_class() {
    local file=$1
    local class_name=$(basename "$file" .java)
    
    echo "🔧 Génération des getters/setters pour $file"
    
    # Sauvegarder le contenu original
    cp "$file" "${file}.backup"
    
    # Extraction des champs
    grep -E "^\s*(private|protected)\s+[A-Za-z0-9<>._]+\s+[a-zA-Z_][a-zA-Z0-9_]*;" "$file" | while read -r field; do
        # Extraire le type et le nom du champ
        type=$(echo "$field" | sed -E 's/^\s*(private|protected)\s+([A-Za-z0-9<>._]+)\s+([a-zA-Z_][a-zA-Z0-9_]*);/\2/')
        name=$(echo "$field" | sed -E 's/^\s*(private|protected)\s+([A-Za-z0-9<>._]+)\s+([a-zA-Z_][a-zA-Z0-9_]*);/\3/')
        
        # Capitaliser le premier caractère pour le getter/setter
        capitalized=$(echo "${name:0:1}" | tr '[:lower:]' '[:upper:]')${name:1}
        
        # Générer getter
        echo "    public $type get$capitalized() { return $name; }"
        
        # Générer setter (sauf pour les champs finaux)
        if ! echo "$field" | grep -q "final"; then
            echo "    public void set$capitalized($type $name) { this.$name = $name; }"
        fi
    done
}

# Appliquer aux fichiers principaux
FILES=(
    "src/main/java/com/vehicules/core/entities/Commande.java"
    "src/main/java/com/vehicules/core/entities/LigneCommande.java"
    "src/main/java/com/vehicules/core/entities/Vehicule.java"
    "src/main/java/com/vehicules/core/entities/Client.java"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        generate_for_class "$file"
    else
        echo "⚠️  Fichier non trouvé: $file"
    fi
done

echo "✅ Génération terminée. Vérifiez les fichiers .backup"
