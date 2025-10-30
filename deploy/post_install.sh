#!/bin/bash
# Script post-installation NOIA_SGM après upload FileZilla
# À exécuter sur le serveur après avoir uploadé les fichiers
# Usage: cd /var/www/noia_sgm && sudo bash deploy/post_install.sh

set -e

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonctions
log_info() { echo -e "${GREEN}✓${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1"; }
log_warn() { echo -e "${YELLOW}!${NC} $1"; }

echo "=============================================="
echo "NOIA_SGM - Post-installation"
echo "Domaine: noia.erelys.fr"
echo "=============================================="
echo

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    log_error "Ce script doit être exécuté depuis /var/www/noia_sgm"
    log_error "Usage: cd /var/www/noia_sgm && sudo bash deploy/post_install.sh"
    exit 1
fi

# 1. Vérifier le fichier .env
echo "1. Vérification de la configuration..."
if [ ! -f "backend/.env" ]; then
    log_error "Fichier backend/.env manquant !"
    log_error "Créez-le avec votre clé API OpenAI avant de continuer"
    exit 1
fi

if grep -q "sk-your-openai-api-key-here" backend/.env; then
    log_error "La clé API OpenAI n'est pas configurée dans backend/.env"
    log_error "Éditez le fichier et ajoutez votre vraie clé API"
    exit 1
fi

log_info "Fichier .env présent et configuré"

# 2. Vérifier Python
echo
echo "2. Vérification de Python..."
if ! command -v python3 &> /dev/null; then
    log_warn "Python 3 n'est pas installé, installation..."
    apt update
    apt install -y python3 python3-pip python3-venv
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
log_info "Python installé : $PYTHON_VERSION"

# 3. Créer l'environnement virtuel
echo
echo "3. Configuration de l'environnement virtuel Python..."
cd backend

if [ -d "venv" ]; then
    log_warn "Environnement virtuel existant, suppression..."
    rm -rf venv
fi

python3 -m venv venv
log_info "Environnement virtuel créé"

# 4. Installer les dépendances
echo
echo "4. Installation des dépendances Python..."
source venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
log_info "Dépendances installées"

# 5. Test du backend
echo
echo "5. Test de l'application..."
python3 -c "from app.main import app; print('Import OK')" 2>/dev/null
if [ $? -eq 0 ]; then
    log_info "Application valide"
else
    log_error "Erreur lors de l'import de l'application"
    exit 1
fi

cd ..

# 6. Configurer les permissions
echo
echo "6. Configuration des permissions..."
chown -R www-data:www-data /var/www/noia_sgm
chmod -R 755 /var/www/noia_sgm
chmod 600 /var/www/noia_sgm/backend/.env
log_info "Permissions configurées"

# 7. Installer le service systemd
echo
echo "7. Installation du service systemd..."
if [ -f "deploy/noia-sgm.service" ]; then
    cp deploy/noia-sgm.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable noia-sgm
    log_info "Service systemd installé"
else
    log_warn "Fichier noia-sgm.service non trouvé, ignoré"
fi

# 8. Démarrer le service
echo
echo "8. Démarrage du service..."
systemctl restart noia-sgm
sleep 2

if systemctl is-active --quiet noia-sgm; then
    log_info "Service NOIA_SGM démarré avec succès"
else
    log_error "Le service n'a pas démarré correctement"
    log_error "Vérifiez les logs : journalctl -u noia-sgm -n 50"
    exit 1
fi

# 9. Vérifier Nginx
echo
echo "9. Vérification de Nginx..."
if ! command -v nginx &> /dev/null; then
    log_warn "Nginx n'est pas installé, installation..."
    apt install -y nginx
fi

# 10. Configurer Nginx
echo
echo "10. Configuration de Nginx..."
if [ -f "deploy/nginx.conf" ]; then
    cp deploy/nginx.conf /etc/nginx/sites-available/noia-sgm
    ln -sf /etc/nginx/sites-available/noia-sgm /etc/nginx/sites-enabled/

    # Supprimer la config par défaut si elle existe
    rm -f /etc/nginx/sites-enabled/default

    # Tester la configuration
    nginx -t
    if [ $? -eq 0 ]; then
        log_info "Configuration Nginx valide"
        systemctl restart nginx
        log_info "Nginx redémarré"
    else
        log_error "Configuration Nginx invalide"
        exit 1
    fi
else
    log_warn "Fichier nginx.conf non trouvé, ignoré"
fi

# 11. Test de l'API
echo
echo "11. Test de l'API..."
sleep 2
HEALTH_CHECK=$(curl -s http://localhost:8000/health 2>/dev/null)
if echo "$HEALTH_CHECK" | grep -q "healthy"; then
    log_info "API répond correctement"
    echo "   Réponse: $HEALTH_CHECK"
else
    log_warn "L'API ne répond pas encore, vérifiez les logs"
fi

# 12. Instructions SSL
echo
echo "=============================================="
log_info "Installation de base terminée !"
echo "=============================================="
echo
echo "📋 Prochaines étapes :"
echo
log_warn "1. Installer SSL avec Let's Encrypt :"
echo "   sudo apt install certbot python3-certbot-nginx -y"
echo "   sudo certbot --nginx -d noia.erelys.fr"
echo
log_warn "2. Configurer le firewall (optionnel) :"
echo "   sudo ufw allow 22/tcp"
echo "   sudo ufw allow 80/tcp"
echo "   sudo ufw allow 443/tcp"
echo "   sudo ufw enable"
echo
echo "📊 Commandes utiles :"
echo "   sudo systemctl status noia-sgm     # Voir l'état du service"
echo "   sudo journalctl -u noia-sgm -f     # Voir les logs"
echo "   sudo systemctl restart noia-sgm    # Redémarrer"
echo
echo "🌐 Une fois SSL installé, accédez à :"
echo "   https://noia.erelys.fr"
echo
echo "=============================================="
