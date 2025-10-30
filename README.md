# NOIA_SGM - Secrétaire Générale de Mairie numérique

🏛️ **L'intelligence administrative partagée des petites communes**

Application web sécurisée d'assistance administrative pour les secrétaires généraux de mairie, agents territoriaux et élus de communes de moins de 3 500 habitants.

## 🎯 Description

NOIA_SGM est une interface web épurée intégrant l'API OpenAI GPT-4/5 pour fournir une assistance administrative structurée, juridique, financière, RH et numérique aux petites collectivités territoriales.

### Fonctionnalités principales

- **Assistance administrative complète** : délibérations, convocations, PV, arrêtés
- **Expertise juridique** : références légales, codes consolidés, conformité
- **Finances publiques** : imputation M57A, équilibre budgétaire, FCTVA
- **Ressources humaines** : carrières, rémunérations, IFSE, positions statutaires
- **Réponses structurées** : format normalisé en 4 sections (références, analyse, application, proposition)
- **Interface épurée** : mode sombre, responsive, stockage local
- **Sécurité** : HTTPS, headers sécurisés, pas de collecte de données

## 🏗️ Architecture

### Backend
- **Framework** : FastAPI (Python 3.10+)
- **API IA** : OpenAI GPT-4/5
- **Serveur** : Uvicorn (ASGI)
- **Configuration** : Pydantic Settings

### Frontend
- **HTML5/CSS3** : Interface responsive avec mode sombre
- **JavaScript** : Vanilla JS, aucune dépendance externe
- **Stockage** : LocalStorage (conversations côté client)
- **Design** : Épuré et institutionnel (Segoe UI, Inter, Roboto)

### Infrastructure
- **Reverse Proxy** : Nginx
- **Service** : systemd
- **SSL/TLS** : Support HTTPS complet
- **Hébergement** : Compatible OVH et tout serveur Linux

## 📋 Prérequis

- **Serveur** : Linux (Ubuntu 20.04+ ou Debian 10+ recommandé)
- **Python** : 3.10 ou supérieur
- **Nginx** : Version récente
- **Clé API** : OpenAI API Key valide
- **Certificat SSL** : Recommandé pour la production (Let's Encrypt)

## 🚀 Installation

### Option 1 : Déploiement automatique

```bash
# Cloner le dépôt
git clone https://github.com/votre-repo/noia-sgm.git
cd noia-sgm

# Exécuter le script de déploiement (en tant que root)
sudo ./deploy/deploy.sh
```

### Option 2 : Installation manuelle

#### 1. Préparer l'environnement

```bash
# Créer les répertoires
sudo mkdir -p /var/www/noia_sgm
cd /var/www/noia_sgm

# Cloner les fichiers
git clone https://github.com/votre-repo/noia-sgm.git .
```

#### 2. Configurer le backend

```bash
cd backend

# Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
nano .env
```

Éditer le fichier `.env` et configurer au minimum :

```env
OPENAI_API_KEY=sk-votre-cle-api-openai
OPENAI_MODEL=gpt-4
DEBUG=false
```

#### 3. Configurer Nginx

```bash
# Copier la configuration
sudo cp deploy/nginx.conf /etc/nginx/sites-available/noia-sgm

# Adapter la configuration à votre domaine
sudo nano /etc/nginx/sites-available/noia-sgm

# Activer le site
sudo ln -s /etc/nginx/sites-available/noia-sgm /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

#### 4. Configurer le service systemd

```bash
# Copier le fichier de service
sudo cp deploy/noia-sgm.service /etc/systemd/system/

# Recharger systemd
sudo systemctl daemon-reload

# Activer et démarrer le service
sudo systemctl enable noia-sgm
sudo systemctl start noia-sgm

# Vérifier le statut
sudo systemctl status noia-sgm
```

#### 5. Configurer SSL (Let's Encrypt)

```bash
# Installer certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot --nginx -d votre-domaine.fr

# Le renouvellement automatique est configuré
```

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# API OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-votre-cle-api
OPENAI_MODEL=gpt-4

# Configuration serveur
HOST=0.0.0.0
PORT=8000
DEBUG=false

# CORS (adapter à votre domaine en production)
CORS_ORIGINS=["https://votre-domaine.fr"]

# Paramètres OpenAI
MAX_TOKENS=2000
TEMPERATURE=0.3
```

### Sécurité

L'application inclut par défaut :
- HTTPS/TLS recommandé (configuration Nginx incluse)
- En-têtes de sécurité (HSTS, CSP, X-Frame-Options, etc.)
- Pas de collecte de données utilisateur
- Stockage local uniquement (conversations dans le navigateur)
- Rate limiting possible via Nginx

## 📖 Utilisation

1. **Accéder à l'application** : `https://votre-domaine.fr`

2. **Poser une question** : Saisir votre question administrative dans le champ de texte

3. **Recevoir une réponse structurée** :
   - 1️⃣ Références juridiques ou comptables
   - 2️⃣ Analyse de la situation
   - 3️⃣ Application pratique
   - 4️⃣ Proposition d'acte ou de texte

4. **Gérer les conversations** :
   - Historique sauvegardé localement dans le navigateur
   - Nouvelle conversation : bouton `+`
   - Afficher l'historique : bouton `📋`
   - Effacer l'historique : bouton dans la sidebar

5. **Thème** : Basculer entre mode sombre/clair avec le bouton `🌙`

## 🛠️ Maintenance

### Logs

```bash
# Logs du service backend
sudo journalctl -u noia-sgm -f

# Logs Nginx
sudo tail -f /var/log/nginx/noia_sgm_access.log
sudo tail -f /var/log/nginx/noia_sgm_error.log
```

### Redémarrage

```bash
# Redémarrer le backend
sudo systemctl restart noia-sgm

# Redémarrer Nginx
sudo systemctl restart nginx

# Redémarrer les deux
sudo systemctl restart noia-sgm nginx
```

### Mise à jour

```bash
# Récupérer les dernières modifications
cd /var/www/noia_sgm
git pull

# Mettre à jour les dépendances Python
cd backend
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Redémarrer le service
sudo systemctl restart noia-sgm
```

## 🔍 Dépannage

### Le service ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u noia-sgm -n 50

# Vérifier la configuration .env
cat backend/.env

# Tester manuellement
cd /var/www/noia_sgm/backend
source venv/bin/activate
python -m app.main
```

### Erreur 502 Bad Gateway

- Vérifier que le service backend tourne : `systemctl status noia-sgm`
- Vérifier que le port 8000 est bien accessible : `netstat -tlnp | grep 8000`
- Vérifier les logs Nginx

### Erreur OpenAI API

- Vérifier la clé API dans `.env`
- Vérifier les quotas OpenAI
- Vérifier les logs : `journalctl -u noia-sgm -f`

## 📁 Structure du projet

```
noia-sgm/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Application FastAPI principale
│   │   ├── config.py            # Configuration
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── chat.py          # Endpoints de chat
│   ├── requirements.txt         # Dépendances Python
│   └── .env.example            # Variables d'environnement exemple
├── frontend/
│   ├── index.html              # Page principale
│   ├── css/
│   │   └── styles.css          # Styles (mode sombre/clair)
│   └── js/
│       └── app.js              # Logique application
├── deploy/
│   ├── nginx.conf              # Configuration Nginx
│   ├── noia-sgm.service        # Service systemd
│   └── deploy.sh               # Script de déploiement
├── .gitignore
└── README.md
```

## 🔐 Sécurité et conformité

### RGPD

- **Aucune collecte de données** : Toutes les conversations sont stockées localement dans le navigateur
- **Pas de cookies tiers**
- **Pas de tracking**
- Les requêtes à l'API OpenAI sont soumises à leur politique de confidentialité

### Recommandations

- ✅ Utiliser HTTPS en production (obligatoire)
- ✅ Mettre à jour régulièrement les dépendances
- ✅ Limiter l'accès au serveur (firewall)
- ✅ Monitorer les logs pour détecter les abus
- ✅ Sauvegarder régulièrement la configuration
- ⚠️ Ne jamais commiter le fichier `.env`
- ⚠️ Protéger l'accès à la clé API OpenAI

## 📝 Sources officielles

NOIA_SGM s'appuie sur des sources officielles :

- **Légifrance** : Codes consolidés (CGCT, CGFP, Code du travail)
- **DGCL** : Direction Générale des Collectivités Locales
- **DGFiP** : Direction Générale des Finances Publiques
- **CNFPT** : Centre National de la Fonction Publique Territoriale
- **Service-public.fr** : Portail officiel de l'administration française

## ⚖️ Avertissement

Tous les actes, calculs et documents générés par NOIA_SGM **doivent être validés par le secrétaire général de mairie avant signature ou mise en paiement**. Cette application est un outil d'assistance et ne remplace pas l'expertise humaine.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Support

Pour toute question ou assistance :
- Documentation : Voir ce README
- Issues : Créer une issue sur GitHub
- Support technique : [Votre contact]

## 🚀 Version

**Version actuelle** : 1.0.0

### Changelog

- **v1.0.0** (2024) : Version initiale
  - Interface web avec mode sombre
  - Intégration OpenAI GPT-4
  - Réponses structurées en 4 sections
  - Stockage local des conversations
  - Configuration Nginx et systemd
  - Documentation complète

---

**NOIA_SGM** - L'intelligence administrative partagée des petites communes 🏛️
