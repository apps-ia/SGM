# Guide de déploiement NOIA_SGM via FileZilla sur OVH

Ce guide vous explique comment déployer l'application NOIA_SGM sur votre serveur OVH en utilisant FileZilla (FTP/SFTP).

## 📋 Prérequis

### Sur votre ordinateur
- [FileZilla Client](https://filezilla-project.org/) installé
- Accès à votre dépôt Git ou fichiers du projet

### Sur votre serveur OVH
- Serveur avec accès SSH/SFTP
- Python 3.10+ installé
- Nginx installé
- Accès root ou sudo

### Informations nécessaires
- **Domaine** : noia.erelys.fr
- **Hôte SSH/SFTP** : (fourni par OVH, ex: ssh.cluster0XX.hosting.ovh.net ou IP du serveur)
- **Utilisateur SSH** : (votre identifiant OVH ou utilisateur serveur)
- **Mot de passe** : (votre mot de passe SSH)
- **Port** : 22 (SSH/SFTP) ou 21 (FTP)
- **Clé API OpenAI** : sk-votre-cle-api

## 🚀 Étape 1 : Connexion avec FileZilla

### 1.1 Configurer la connexion

1. Ouvrir FileZilla
2. Aller dans **Fichier** > **Gestionnaire de sites**
3. Cliquer sur **Nouveau site** et nommer "NOIA OVH"
4. Configurer :

   ```
   Protocole : SFTP - SSH File Transfer Protocol
   Hôte : ssh.cluster0XX.hosting.ovh.net (ou IP de votre serveur)
   Port : 22
   Type d'authentification : Normale
   Identifiant : votre_login_ssh
   Mot de passe : votre_mot_de_passe
   ```

5. Cliquer sur **Connexion**

### 1.2 Accepter la clé SSH

La première fois, FileZilla vous demandera de confirmer la clé SSH du serveur.
Cocher "Toujours faire confiance à cet hôte" et cliquer sur **OK**.

## 📁 Étape 2 : Préparation des fichiers locaux

### 2.1 Préparer le projet

Sur votre ordinateur :

```bash
# Cloner le projet (si pas déjà fait)
git clone [votre-repo] noia-sgm
cd noia-sgm

# Créer le fichier .env avec vos vraies informations
cp backend/.env.example backend/.env
```

### 2.2 Éditer le fichier .env

Ouvrir `backend/.env` avec un éditeur de texte et configurer :

```env
# API OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-votre-vraie-cle-api-openai
OPENAI_MODEL=gpt-4

# Configuration serveur
HOST=0.0.0.0
PORT=8000
DEBUG=false

# CORS - Domaine de production
CORS_ORIGINS=["https://noia.erelys.fr"]

# Paramètres OpenAI
MAX_TOKENS=2000
TEMPERATURE=0.3
```

⚠️ **IMPORTANT** : Remplacer `sk-votre-vraie-cle-api-openai` par votre vraie clé OpenAI !

## 📤 Étape 3 : Upload des fichiers avec FileZilla

### 3.1 Structure sur le serveur

Sur le serveur, créer la structure suivante (partie gauche de FileZilla = local, partie droite = serveur) :

```
/var/www/noia_sgm/
├── backend/
│   ├── app/
│   ├── .env          # ← IMPORTANT : avec vos vraies infos
│   └── requirements.txt
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
└── deploy/
    ├── nginx.conf
    ├── noia-sgm.service
    └── deploy.sh
```

### 3.2 Créer les dossiers sur le serveur

**Option A : Via FileZilla**
1. Dans la partie droite (serveur), naviguer vers `/var/www/`
2. Clic droit > **Créer le répertoire** > `noia_sgm`
3. Entrer dans `noia_sgm` et créer les sous-dossiers : `backend`, `frontend`, `deploy`

**Option B : Via SSH (recommandé)**

Ouvrir un terminal SSH séparé (PuTTY sur Windows ou Terminal sur Mac/Linux) :

```bash
ssh votre_login@ssh.cluster0XX.hosting.ovh.net
sudo mkdir -p /var/www/noia_sgm/{backend,frontend,deploy}
sudo chown -R $USER:$USER /var/www/noia_sgm
```

### 3.3 Upload des fichiers

Dans FileZilla :

1. **Panel gauche** (local) : Naviguer vers votre dossier `noia-sgm`
2. **Panel droite** (serveur) : Naviguer vers `/var/www/noia_sgm`

3. **Uploader le backend** :
   - Glisser-déposer tout le dossier `backend/` vers le serveur
   - ⚠️ Vérifier que `backend/.env` est bien uploadé avec vos vraies infos

4. **Uploader le frontend** :
   - Glisser-déposer tout le dossier `frontend/` vers le serveur

5. **Uploader le deploy** :
   - Glisser-déposer tout le dossier `deploy/` vers le serveur

6. **Uploader les fichiers racine** (optionnel) :
   - `README.md`, `LICENSE`, etc.

### 3.4 Vérification

Dans FileZilla, vérifier que la structure côté serveur ressemble à :

```
/var/www/noia_sgm/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   └── routers/
│   ├── .env                    # ← Vérifier présence !
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
└── deploy/
    ├── nginx.conf
    ├── noia-sgm.service
    └── deploy.sh
```

## 🔧 Étape 4 : Configuration du serveur via SSH

Maintenant, se connecter au serveur via SSH pour configurer l'environnement.

### 4.1 Connexion SSH

```bash
# Depuis votre terminal (Mac/Linux) ou PuTTY (Windows)
ssh votre_login@ssh.cluster0XX.hosting.ovh.net
```

Ou utiliser l'outil SSH de FileZilla : **Serveur** > **Lancer une commande SSH personnalisée**

### 4.2 Installation de Python et dépendances

```bash
# Vérifier Python
python3 --version  # Doit être 3.10+

# Si Python n'est pas installé
sudo apt update
sudo apt install python3 python3-pip python3-venv nginx -y
```

### 4.3 Configuration de l'environnement virtuel

```bash
# Aller dans le dossier backend
cd /var/www/noia_sgm/backend

# Créer l'environnement virtuel
python3 -m venv venv

# Activer l'environnement
source venv/bin/activate

# Installer les dépendances
pip install --upgrade pip
pip install -r requirements.txt
```

### 4.4 Tester le backend

```bash
# Toujours dans /var/www/noia_sgm/backend avec venv activé
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Vous devriez voir :
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

Dans un autre terminal ou onglet, tester :

```bash
curl http://localhost:8000/health
# Devrait retourner : {"status":"healthy","service":"NOIA_SGM","version":"1.0.0"}
```

Si ça fonctionne, appuyer sur **Ctrl+C** pour arrêter le serveur de test.

## ⚙️ Étape 5 : Configuration du service systemd

### 5.1 Installer le service

```bash
# Copier le fichier de service
sudo cp /var/www/noia_sgm/deploy/noia-sgm.service /etc/systemd/system/

# Recharger systemd
sudo systemctl daemon-reload

# Activer le service (démarrage automatique)
sudo systemctl enable noia-sgm

# Démarrer le service
sudo systemctl start noia-sgm

# Vérifier le statut
sudo systemctl status noia-sgm
```

Vous devriez voir :

```
● noia-sgm.service - NOIA_SGM - Secrétaire Générale de Mairie numérique
   Loaded: loaded
   Active: active (running)
```

### 5.2 Vérifier les logs

```bash
# Voir les logs en temps réel
sudo journalctl -u noia-sgm -f

# Appuyer sur Ctrl+C pour quitter
```

## 🌐 Étape 6 : Configuration de Nginx

### 6.1 Copier la configuration

```bash
# Copier le fichier de configuration
sudo cp /var/www/noia_sgm/deploy/nginx.conf /etc/nginx/sites-available/noia-sgm

# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/noia-sgm /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t
```

Si tout est OK, vous verrez :

```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6.2 Redémarrer Nginx

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

## 🔐 Étape 7 : Configuration SSL avec Let's Encrypt

### 7.1 Installer Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Obtenir le certificat SSL

```bash
# Obtenir et installer automatiquement le certificat
sudo certbot --nginx -d noia.erelys.fr

# Suivre les instructions :
# 1. Entrer votre email
# 2. Accepter les conditions
# 3. Choisir de rediriger HTTP vers HTTPS (option 2)
```

### 7.3 Tester le renouvellement automatique

```bash
# Tester le renouvellement (dry-run)
sudo certbot renew --dry-run
```

Le renouvellement automatique est configuré via cron/systemd timer.

## 🔒 Étape 8 : Configuration du firewall (optionnel)

```bash
# Activer le firewall
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# Vérifier
sudo ufw status
```

## ✅ Étape 9 : Test final

### 9.1 Tester l'application

1. Ouvrir un navigateur
2. Aller sur : **https://noia.erelys.fr**
3. Vous devriez voir l'interface NOIA_SGM

### 9.2 Tester l'API

```bash
# Test du health check
curl https://noia.erelys.fr/health

# Test de l'API (avec jq pour formater)
curl -X POST https://noia.erelys.fr/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Bonjour NOIA_SGM"}' | jq
```

### 9.3 Vérifier les logs

```bash
# Logs du backend
sudo journalctl -u noia-sgm -f

# Logs Nginx
sudo tail -f /var/log/nginx/noia_sgm_access.log
sudo tail -f /var/log/nginx/noia_sgm_error.log
```

## 🔄 Étape 10 : Mises à jour futures

### Méthode 1 : Via FileZilla (simple)

1. Modifier les fichiers localement
2. Se connecter avec FileZilla
3. Uploader les fichiers modifiés
4. Redémarrer le service :

```bash
ssh votre_login@serveur
sudo systemctl restart noia-sgm
```

### Méthode 2 : Via Git (recommandé)

```bash
# Sur le serveur
cd /var/www/noia_sgm
git pull origin main

# Mettre à jour les dépendances Python (si nécessaire)
cd backend
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Redémarrer
sudo systemctl restart noia-sgm
```

## 🆘 Dépannage

### Le service ne démarre pas

```bash
# Voir les erreurs
sudo journalctl -u noia-sgm -n 50

# Vérifier la configuration .env
cat /var/www/noia_sgm/backend/.env

# Tester manuellement
cd /var/www/noia_sgm/backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que le service tourne
sudo systemctl status noia-sgm

# Vérifier que le port 8000 écoute
sudo netstat -tlnp | grep 8000

# Redémarrer les services
sudo systemctl restart noia-sgm
sudo systemctl restart nginx
```

### Erreur OpenAI API

```bash
# Vérifier la clé API dans .env
cd /var/www/noia_sgm/backend
cat .env | grep OPENAI_API_KEY

# Tester la clé manuellement
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $(grep OPENAI_API_KEY .env | cut -d= -f2)"
```

### Permissions incorrectes

```bash
# Corriger les permissions
sudo chown -R www-data:www-data /var/www/noia_sgm
sudo chmod -R 755 /var/www/noia_sgm
sudo chmod 600 /var/www/noia_sgm/backend/.env
```

## 📝 Checklist finale

- [ ] Fichiers uploadés via FileZilla
- [ ] Fichier `.env` configuré avec la vraie clé OpenAI
- [ ] Environnement virtuel Python créé
- [ ] Dépendances installées (`pip install -r requirements.txt`)
- [ ] Service systemd installé et démarré
- [ ] Nginx configuré et redémarré
- [ ] SSL Let's Encrypt installé
- [ ] Firewall activé (optionnel)
- [ ] Application accessible sur https://noia.erelys.fr
- [ ] Test de l'API réussi
- [ ] Logs vérifiés (pas d'erreurs)

## 🎉 Félicitations !

Votre application NOIA_SGM est maintenant déployée sur **https://noia.erelys.fr** !

## 📞 Commandes utiles

```bash
# Voir les logs en temps réel
sudo journalctl -u noia-sgm -f

# Redémarrer le backend
sudo systemctl restart noia-sgm

# Redémarrer Nginx
sudo systemctl restart nginx

# Vérifier l'état des services
sudo systemctl status noia-sgm
sudo systemctl status nginx

# Se connecter au serveur
ssh votre_login@serveur

# Sauvegarder la configuration
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/noia_sgm/backend/.env
```

## 📚 Documentation complémentaire

- [README.md](../README.md) - Documentation complète
- [QUICK_START.md](../QUICK_START.md) - Guide de démarrage rapide
- [SECURITY.md](../SECURITY.md) - Politique de sécurité

---

**Note** : En cas de problème, n'hésitez pas à consulter les logs et la documentation complète.
