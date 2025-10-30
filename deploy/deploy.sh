#!/bin/bash
# Script de déploiement NOIA_SGM sur serveur OVH
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "=========================================="
echo "Déploiement NOIA_SGM"
echo "=========================================="

# Variables de configuration
APP_DIR="/var/www/noia_sgm"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
REPO_URL="https://votre-repo.git"  # À modifier

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que le script est exécuté en tant que root ou avec sudo
if [ "$EUID" -ne 0 ]; then
    log_error "Ce script doit être exécuté en tant que root ou avec sudo"
    exit 1
fi

# 1. Créer les répertoires si nécessaire
log_info "Création des répertoires..."
mkdir -p $APP_DIR
mkdir -p $BACKEND_DIR
mkdir -p $FRONTEND_DIR

# 2. Installer les dépendances système si nécessaire
log_info "Vérification des dépendances système..."
if ! command -v python3 &> /dev/null; then
    log_info "Installation de Python 3..."
    apt-get update
    apt-get install -y python3 python3-pip python3-venv
fi

if ! command -v nginx &> /dev/null; then
    log_info "Installation de Nginx..."
    apt-get install -y nginx
fi

# 3. Copier les fichiers
log_info "Copie des fichiers de l'application..."
cp -r ./backend/* $BACKEND_DIR/
cp -r ./frontend/* $FRONTEND_DIR/

# 4. Créer et activer l'environnement virtuel Python
log_info "Configuration de l'environnement Python..."
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate

# 5. Installer les dépendances Python
log_info "Installation des dépendances Python..."
pip install --upgrade pip
pip install -r requirements.txt

# 6. Configuration de l'environnement
if [ ! -f "$BACKEND_DIR/.env" ]; then
    log_warn "Fichier .env non trouvé, création depuis .env.example..."
    cp $BACKEND_DIR/.env.example $BACKEND_DIR/.env
    log_warn "IMPORTANT: Éditer le fichier $BACKEND_DIR/.env avec vos clés API"
    log_warn "En particulier, configurez OPENAI_API_KEY"
fi

# 7. Configurer les permissions
log_info "Configuration des permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR

# 8. Configurer Nginx
log_info "Configuration de Nginx..."
if [ -f "./deploy/nginx.conf" ]; then
    cp ./deploy/nginx.conf /etc/nginx/sites-available/noia-sgm
    ln -sf /etc/nginx/sites-available/noia-sgm /etc/nginx/sites-enabled/noia-sgm

    # Tester la configuration Nginx
    nginx -t

    log_info "Redémarrage de Nginx..."
    systemctl restart nginx
else
    log_warn "Fichier nginx.conf non trouvé, ignoré"
fi

# 9. Configurer le service systemd
log_info "Configuration du service systemd..."
if [ -f "./deploy/noia-sgm.service" ]; then
    cp ./deploy/noia-sgm.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable noia-sgm

    log_info "Démarrage du service NOIA_SGM..."
    systemctl restart noia-sgm
else
    log_warn "Fichier noia-sgm.service non trouvé, ignoré"
fi

# 10. Vérifier l'état du service
sleep 2
log_info "Vérification de l'état du service..."
if systemctl is-active --quiet noia-sgm; then
    log_info "✅ Service NOIA_SGM démarré avec succès"
else
    log_error "❌ Le service NOIA_SGM n'a pas démarré correctement"
    log_error "Vérifier les logs avec: journalctl -u noia-sgm -f"
    exit 1
fi

# 11. Afficher le statut
echo ""
echo "=========================================="
echo "Déploiement terminé !"
echo "=========================================="
echo ""
log_info "Vérifier le service: systemctl status noia-sgm"
log_info "Voir les logs: journalctl -u noia-sgm -f"
log_info "Redémarrer: systemctl restart noia-sgm"
echo ""
log_warn "N'oubliez pas de:"
log_warn "1. Configurer votre clé API OpenAI dans $BACKEND_DIR/.env"
log_warn "2. Configurer votre nom de domaine dans /etc/nginx/sites-available/noia-sgm"
log_warn "3. Installer un certificat SSL (Let's Encrypt recommandé)"
echo ""
