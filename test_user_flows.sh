#!/bin/bash

# Script de test automatisé des parcours utilisateur
# Véhicules Online

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${1:-http://localhost:9090/api}"
TEST_EMAIL="testuser_$(date +%s)@example.com"
TEST_PASSWORD="TestPass123!"

# Compteurs de tests
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Fonction pour afficher les logs
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonction pour tester une requête HTTP
test_api() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local token="$5"
    local expected_status="${6:-200}"
    
    ((TESTS_RUN++))
    
    log_info "Test: $name"
    log_info "Requête: $method $API_URL$endpoint"
    
    if [ -z "$token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"})
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            ${data:+-d "$data"})
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    response_body=$(echo "$response" | head -n -1)
    
    if [[ $http_code == $expected_status* ]]; then
        log_success "$name (HTTP $http_code)"
        echo "$response_body"
    else
        log_error "$name - Expected $expected_status, got $http_code"
        echo "Response: $response_body"
        return 1
    fi
}

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🧪 Tests des Parcours Utilisateur - Véhicules Online  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Vérifier la connexion au backend
log_info "Vérification de la connexion au backend..."
if ! curl -s "$API_URL/test" > /dev/null 2>&1; then
    log_error "Impossible de se connecter à $API_URL"
    log_error "Assurez-vous que le backend est démarré"
    exit 1
fi
log_success "Connexion à $API_URL établie"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}TEST 1: INSCRIPTION ET AUTHENTIFICATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Test 1.1 - Inscription
log_info "Test 1.1: Inscription d'un nouvel utilisateur"
register_response=$(test_api \
    "Inscription" \
    "POST" \
    "/auth/register" \
    "{\"nom\":\"TestUser\",\"prenom\":\"Test\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"customer_type\":\"individual\"}" \
    "" \
    "200")

# Extraire le token
TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
    log_warning "Token non trouvé dans la réponse d'inscription"
    # Essayer la connexion
    echo -e "\n${YELLOW}Tentative de connexion...${NC}"
    login_response=$(test_api \
        "Connexion" \
        "POST" \
        "/auth/login" \
        "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
        "" \
        "200")
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

if [ -n "$TOKEN" ]; then
    log_success "Token obtenu: ${TOKEN:0:20}..."
else
    log_error "Impossible d'obtenir un token"
    exit 1
fi

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}TEST 2: CATALOGUE DE VÉHICULES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Test 2.1 - Récupérer le catalogue
log_info "Test 2.1: Récupération du catalogue"
catalogue_response=$(test_api \
    "Catalogue" \
    "GET" \
    "/catalogue" \
    "" \
    "$TOKEN" \
    "200")

# Extraire un ID de véhicule
VEHICLE_ID=$(echo "$catalogue_response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
if [ -n "$VEHICLE_ID" ]; then
    log_success "Catalogue chargé, véhicule trouvé: ID $VEHICLE_ID"
else
    log_warning "Aucun véhicule trouvé dans le catalogue"
    VEHICLE_ID="1"
fi

# Test 2.2 - Détail d'un véhicule
if [ -n "$VEHICLE_ID" ]; then
    test_api \
        "Détail du véhicule" \
        "GET" \
        "/catalogue/$VEHICLE_ID" \
        "" \
        "$TOKEN" \
        "200" > /dev/null || log_warning "Détail du véhicule indisponible"
fi

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}TEST 3: GESTION DU PANIER${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Test 3.1 - Ajouter au panier
if [ -n "$VEHICLE_ID" ]; then
    test_api \
        "Ajouter au panier" \
        "POST" \
        "/panier/ajouter" \
        "{\"vehicule_id\":$VEHICLE_ID,\"quantite\":1}" \
        "$TOKEN" \
        "200" > /dev/null || log_warning "Ajout au panier échoué"
fi

# Test 3.2 - Consulter le panier
test_api \
    "Consulter le panier" \
    "GET" \
    "/panier" \
    "" \
    "$TOKEN" \
    "200" > /dev/null || log_warning "Consultation du panier échouée"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}TEST 4: CRÉER UNE COMMANDE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Test 4.1 - Créer une commande
if [ -n "$VEHICLE_ID" ]; then
    test_api \
        "Créer une commande" \
        "POST" \
        "/commandes" \
        "{\"client_id\":1,\"type_paiement\":\"COMPTANT\",\"vehicule_ids\":[$VEHICLE_ID],\"pays_livraison\":\"FR\"}" \
        "$TOKEN" \
        "200" > /dev/null || log_warning "Création de commande échouée"
fi

# Test 4.2 - Consulter les commandes
test_api \
    "Consulter mes commandes" \
    "GET" \
    "/commandes/mes-commandes" \
    "" \
    "$TOKEN" \
    "200" > /dev/null || log_warning "Consultation des commandes échouée"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}TEST 5: FORMULAIRES ET DOCUMENTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Test 5.1 - Générer un document minimal
test_api \
    "Générer un document" \
    "POST" \
    "/documents/generate-minimal" \
    "{\"format\":\"PDF\",\"numero_serie\":\"TEST001\",\"client_nom\":\"TestUser\",\"vehicule_modele\":\"Test Model\"}" \
    "$TOKEN" \
    "200" > /dev/null || log_warning "Génération de document échouée"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}RÉSUMÉ DES TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo "Total des tests exécutés: $TESTS_RUN"
echo -e "${GREEN}Tests réussis: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Tests échoués: $TESTS_FAILED${NC}"
fi

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Tous les tests sont passés!${NC}\n"
    exit 0
else
    echo -e "\n${RED}⚠️  Certains tests ont échoué.${NC}\n"
    exit 1
fi
