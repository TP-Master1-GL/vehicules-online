#!/bin/bash

FILE="src/main/java/com/vehicules/pdf/services/PdfService.java"

if [ ! -f "$FILE" ]; then
    echo "⚠️  Fichier non trouvé: $FILE"
    exit 1
fi

echo "🔧 Correction des appels à getFinancement() dans PdfService.java..."

# 1. Affichez le contexte pour comprendre ce qui est attendu
echo "📄 Contexte des erreurs (lignes 195-210):"
sed -n '195,210p' "$FILE"

# 2. Selon CommandeCredit.java, remplacez getFinancement() par le champ approprié
# Vous devrez peut-être ajuster manuellement selon le contexte

# Solution temporaire : Commentez ou corrigez les lignes problématiques
sed -i '199s/.*/            // TODO: Remplacer getFinancement() par le champ approprié/' "$FILE"
sed -i '203s/.*/            // TODO: Remplacer getFinancement() par le champ approprié/' "$FILE"
sed -i '204s/.*/            // TODO: Remplacer getFinancement() par le champ approprié/' "$FILE"
sed -i '205s/.*/            // TODO: Remplacer getFinancement() par le champ approprié/' "$FILE"
sed -i '206s/.*/            // TODO: Remplacer getFinancement() par le champ approprié/' "$FILE"

echo "✅ Lignes problématiques commentées"
echo "📋 Vous devrez corriger manuellement ces TODOs selon votre logique métier"
