#!/bin/bash

FILE="src/main/java/com/vehicules/pdf/services/PdfService.java"

echo "🔧 Correction des appels incorrects..."

# Remplaçons les appels à getFinancement().getXXX() par les méthodes directes de CommandeCredit
sed -i 's/commande.getFinancement().getMontant()/commande.getMontantTotal()/g' "$FILE"
sed -i 's/commande.getFinancement().getDuree()/((CommandeCredit) commande).getDureeMois()/g' "$FILE"
sed -i 's/commande.getFinancement().getTaux()/((CommandeCredit) commande).getTauxInteret()/g' "$FILE"
sed -i 's/commande.getFinancement().getMensualite()/((CommandeCredit) commande).getTauxInteret()/g' "$FILE"  # Temporaire

echo "✅ Corrections appliquées :"
echo "  - getFinancement().getMontant() -> getMontantTotal()"
echo "  - getFinancement().getDuree() -> ((CommandeCredit) commande).getDureeMois()"
echo "  - getFinancement().getTaux() -> ((CommandeCredit) commande).getTauxInteret()"
echo "  - getFinancement().getMensualite() -> ((CommandeCredit) commande).getTauxInteret() (temporaire)"

echo ""
echo "📄 Vérification (lignes 200-210):"
sed -n '200,210p' "$FILE"
