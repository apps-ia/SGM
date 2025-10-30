#!/bin/bash
# Script de test local pour NOIA_SGM
# Usage: ./test_local.sh

set -e

echo "=========================================="
echo "Test local NOIA_SGM"
echo "=========================================="
echo

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction de log
log_info() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_warn() { echo -e "${YELLOW}!${NC} $1"; }

# Vérifier Python
echo "1. Vérification de Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    log_info "Python installé : $PYTHON_VERSION"
else
    log_error "Python 3 n'est pas installé"
    exit 1
fi

# Vérifier pip
echo
echo "2. Vérification de pip..."
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version)
    log_info "pip installé : $PIP_VERSION"
else
    log_error "pip n'est pas installé"
    exit 1
fi

# Créer l'environnement virtuel si nécessaire
echo
echo "3. Configuration de l'environnement virtuel..."
cd backend
if [ ! -d "venv" ]; then
    log_info "Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement
source venv/bin/activate

# Installer les dépendances
echo
echo "4. Installation des dépendances..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
log_info "Dépendances installées"

# Vérifier le fichier .env
echo
echo "5. Vérification de la configuration..."
if [ ! -f ".env" ]; then
    log_warn "Fichier .env non trouvé, copie depuis .env.example"
    cp .env.example .env
    log_error "IMPORTANT : Éditer le fichier backend/.env et ajouter votre OPENAI_API_KEY"
    exit 1
fi

# Vérifier la clé API
if grep -q "sk-your-openai-api-key-here" .env; then
    log_error "La clé API OpenAI n'est pas configurée dans backend/.env"
    exit 1
fi

log_info "Configuration OK"

# Tester l'import des modules
echo
echo "6. Test des imports Python..."
python3 -c "from app.main import app; print('Imports OK')" 2>/dev/null
if [ $? -eq 0 ]; then
    log_info "Imports Python OK"
else
    log_error "Erreur lors de l'import des modules"
    exit 1
fi

# Démarrer le serveur en arrière-plan
echo
echo "7. Démarrage du serveur de test..."
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8888 &
SERVER_PID=$!
log_info "Serveur démarré (PID: $SERVER_PID)"

# Attendre que le serveur démarre
echo
echo "8. Attente du démarrage du serveur..."
sleep 3

# Test du health check
echo
echo "9. Test du endpoint /health..."
HEALTH_RESPONSE=$(curl -s http://127.0.0.1:8888/health)
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    log_info "Health check OK"
    echo "   Réponse: $HEALTH_RESPONSE"
else
    log_error "Health check failed"
    kill $SERVER_PID
    exit 1
fi

# Test du endpoint racine
echo
echo "10. Test du endpoint racine..."
ROOT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8888/)
if [ "$ROOT_RESPONSE" = "200" ]; then
    log_info "Endpoint racine OK (HTTP $ROOT_RESPONSE)"
else
    log_error "Endpoint racine failed (HTTP $ROOT_RESPONSE)"
    kill $SERVER_PID
    exit 1
fi

# Test du endpoint chat
echo
echo "11. Test du endpoint /api/chat..."
CHAT_RESPONSE=$(curl -s -X POST http://127.0.0.1:8888/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"Test"}' \
    -w "\n%{http_code}")

HTTP_CODE=$(echo "$CHAT_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$CHAT_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    log_info "Endpoint chat OK (HTTP $HTTP_CODE)"
    echo "   Réponse tronquée: $(echo $RESPONSE_BODY | cut -c 1-100)..."
elif [ "$HTTP_CODE" = "500" ]; then
    log_warn "Endpoint chat retourne HTTP 500 (possible erreur clé API)"
    echo "   Vérifier votre clé OpenAI dans backend/.env"
else
    log_error "Endpoint chat failed (HTTP $HTTP_CODE)"
fi

# Arrêter le serveur
echo
echo "12. Arrêt du serveur de test..."
kill $SERVER_PID
log_info "Serveur arrêté"

# Résumé
echo
echo "=========================================="
echo "Résumé des tests"
echo "=========================================="
echo
log_info "Tests de base réussis"
echo
echo "Pour démarrer le serveur en mode développement :"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python -m uvicorn app.main:app --reload"
echo
echo "Puis ouvrir http://localhost:8000 dans votre navigateur"
echo
echo "=========================================="
