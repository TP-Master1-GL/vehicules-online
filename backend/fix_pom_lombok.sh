#!/bin/bash

# Trouvez la ligne après jjwt-jackson
LINE=$(grep -n "jjwt-jackson" pom.xml | tail -1 | cut -d: -f1)
if [ -n "$LINE" ]; then
    # Ajoutez Lombok après cette ligne
    sed -i "$((LINE+1))i\        \n        <!-- Lombok pour les getters/setters -->\n        <dependency>\n            <groupId>org.projectlombok</groupId>\n            <artifactId>lombok</artifactId>\n            <version>1.18.30</version>\n            <scope>provided</scope>\n        </dependency>" pom.xml
    echo "✅ Lombok ajouté à pom.xml"
else
    echo "⚠️  Section JWT non trouvée, ajout à la fin des dépendances"
    sed -i '/<\/dependencies>/i\        <!-- Lombok pour les getters/setters -->\n        <dependency>\n            <groupId>org.projectlombok</groupId>\n            <artifactId>lombok</artifactId>\n            <version>1.18.30</version>\n            <scope>provided</scope>\n        </dependency>' pom.xml
fi
