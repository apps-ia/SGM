# Déploiement NOIA_SGM sans Git - Guide FileZilla seul

## ⚠️ Pas besoin de Git sur le serveur OVH

Si vous rencontrez l'erreur "Git n'a pas pu être activé" sur OVH, **ce n'est pas grave** !
Avec FileZilla, vous n'avez pas besoin de Git sur le serveur.

## 📦 Méthode 1 : Télécharger le ZIP depuis GitHub (RECOMMANDÉ)

### Étape 1 : Télécharger le code

1. Aller sur votre dépôt GitHub
2. Cliquer sur le bouton vert **"Code"**
3. Choisir **"Download ZIP"**
4. Extraire le ZIP sur votre ordinateur

Ou via la ligne de commande sur votre ordinateur local :

```bash
# Si vous avez Git localement
git clone https://github.com/votre-repo/noia-sgm.git
cd noia-sgm

# Ou télécharger directement le ZIP
wget https://github.com/votre-repo/noia-sgm/archive/refs/heads/claude/noia-sgm-admin-app-011CUdramLi6ucR8yd9k33DS.zip
unzip claude-noia-sgm-admin-app-011CUdramLi6ucR8yd9k33DS.zip
```

### Étape 2 : Configurer le .env

```bash
cd noia-sgm
cp backend/.env.example backend/.env
```

Éditer `backend/.env` avec un éditeur de texte (Notepad++, VS Code, etc.) :

```env
OPENAI_API_KEY=sk-votre-vraie-cle-api-openai-ici
OPENAI_MODEL=gpt-4
HOST=0.0.0.0
PORT=8000
DEBUG=false
CORS_ORIGINS=["https://noia.erelys.fr"]
MAX_TOKENS=2000
TEMPERATURE=0.3
```

⚠️ **IMPORTANT** : Remplacer `sk-votre-vraie-cle-api-openai-ici` par votre vraie clé OpenAI !

### Étape 3 : Upload via FileZilla

#### 3.1 Connexion FileZilla

1. Ouvrir FileZilla
2. Configurer la connexion :
   ```
   Protocole : SFTP - SSH File Transfer Protocol
   Hôte : [votre_serveur_ovh]
   Port : 22
   Utilisateur : [votre_login_ssh]
   Mot de passe : [votre_password]
   ```
3. Cliquer sur **Connexion rapide** ou **Connexion**

#### 3.2 Créer les dossiers sur le serveur

Dans FileZilla (partie droite = serveur) :

1. Naviguer vers `/var/www/` ou `/home/votre_user/`
2. Clic droit → **Créer le répertoire** → `noia_sgm`
3. Entrer dans `noia_sgm`
4. Créer les sous-dossiers :
   - `backend`
   - `frontend`
   - `deploy`

Structure finale :
```
/var/www/noia_sgm/    (ou /home/votre_user/noia_sgm/)
├── backend/
├── frontend/
└── deploy/
```

#### 3.3 Upload des fichiers

**Partie gauche** (votre ordinateur) : Naviguer vers le dossier `noia-sgm` extrait

**Partie droite** (serveur) : Naviguer vers `/var/www/noia_sgm/`

**Glisser-déposer** :
1. Tout le contenu de `backend/` → vers `backend/` sur le serveur
2. Tout le contenu de `frontend/` → vers `frontend/` sur le serveur
3. Tout le contenu de `deploy/` → vers `deploy/` sur le serveur

⏱️ L'upload peut prendre quelques minutes selon votre connexion.

#### 3.4 Vérifier l'upload

Vérifier que ces fichiers sont bien présents sur le serveur :
- ✅ `/var/www/noia_sgm/backend/.env` (avec votre clé API)
- ✅ `/var/www/noia_sgm/backend/app/main.py`
- ✅ `/var/www/noia_sgm/frontend/index.html`
- ✅ `/var/www/noia_sgm/deploy/post_install.sh`

### Étape 4 : Configuration du serveur via SSH

#### 4.1 Connexion SSH

**Option A - Terminal (Mac/Linux)** :
```bash
ssh votre_login@votre_serveur_ovh
```

**Option B - PuTTY (Windows)** :
1. Télécharger PuTTY : https://www.putty.org/
2. Configurer :
   - Host Name : votre_serveur_ovh
   - Port : 22
   - Connection type : SSH
3. Cliquer sur **Open**

**Option C - FileZilla (plus simple)** :
1. Dans FileZilla, aller dans le menu **Serveur** → **Lancer une commande personnalisée**
2. Ou utiliser un terminal SSH séparé

#### 4.2 Vérifier les fichiers uploadés

```bash
# Aller dans le dossier
cd /var/www/noia_sgm

# Lister les fichiers
ls -la

# Vous devriez voir : backend/ frontend/ deploy/
```

#### 4.3 Lancer le script d'installation automatique

```bash
# Donner les permissions d'exécution
chmod +x deploy/post_install.sh

# Lancer le script
sudo bash deploy/post_install.sh
```

Le script va automatiquement :
- ✅ Vérifier Python
- ✅ Créer l'environnement virtuel
- ✅ Installer les dépendances
- ✅ Configurer systemd
- ✅ Configurer Nginx
- ✅ Démarrer les services
- ✅ Tester l'API

**Suivre les instructions affichées par le script.**

### Étape 5 : Installer SSL

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL
sudo certbot --nginx -d noia.erelys.fr
```

Répondre aux questions :
1. **Email** : votre@email.com
2. **Accepter les conditions** : Y
3. **Partager email** : N (optionnel)
4. **Redirection HTTPS** : 2 (Oui, rediriger)

### Étape 6 : Configurer le firewall (optionnel mais recommandé)

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
sudo ufw status
```

### Étape 7 : Test final

```bash
# Vérifier que le service tourne
sudo systemctl status noia-sgm

# Tester l'API localement
curl http://localhost:8000/health

# Tester depuis l'extérieur
curl https://noia.erelys.fr/health
```

Ouvrir un navigateur : **https://noia.erelys.fr**

## 🎉 C'est terminé !

Votre application est maintenant en ligne sur **https://noia.erelys.fr**

## 🔄 Pour mettre à jour l'application plus tard

### Méthode simple avec FileZilla :

1. Modifier les fichiers localement sur votre ordinateur
2. Se connecter avec FileZilla
3. Uploader uniquement les fichiers modifiés
4. Redémarrer le service :

```bash
ssh votre_login@serveur
sudo systemctl restart noia-sgm
```

## 📊 Structure finale sur le serveur

```
/var/www/noia_sgm/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── chat.py
│   ├── venv/                    ← Créé par le script
│   ├── .env                     ← Avec votre clé API !
│   ├── requirements.txt
│   └── test_api.py
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── deploy/
    ├── nginx.conf
    ├── noia-sgm.service
    ├── post_install.sh
    └── README.md
```

## 🆘 Dépannage

### Le script post_install.sh échoue

```bash
# Vérifier les permissions
ls -la /var/www/noia_sgm/deploy/post_install.sh

# Donner les permissions
chmod +x /var/www/noia_sgm/deploy/post_install.sh

# Relancer
sudo bash /var/www/noia_sgm/deploy/post_install.sh
```

### Erreur "Permission denied"

```bash
# Donner les bonnes permissions au dossier
sudo chown -R $USER:$USER /var/www/noia_sgm

# Ou avec l'utilisateur www-data
sudo chown -R www-data:www-data /var/www/noia_sgm
```

### Le service ne démarre pas

```bash
# Voir les erreurs
sudo journalctl -u noia-sgm -n 50

# Vérifier le fichier .env
cat /var/www/noia_sgm/backend/.env

# Vérifier que la clé API est bien configurée
grep OPENAI_API_KEY /var/www/noia_sgm/backend/.env
```

### Python n'est pas installé

```bash
# Installer Python 3
sudo apt update
sudo apt install python3 python3-pip python3-venv -y

# Vérifier la version
python3 --version
```

### Nginx n'est pas installé

```bash
# Installer Nginx
sudo apt update
sudo apt install nginx -y

# Vérifier
nginx -v
```

## 📞 Commandes utiles

```bash
# Voir l'état du service
sudo systemctl status noia-sgm

# Redémarrer le backend
sudo systemctl restart noia-sgm

# Voir les logs en temps réel
sudo journalctl -u noia-sgm -f

# Arrêter le service
sudo systemctl stop noia-sgm

# Démarrer le service
sudo systemctl start noia-sgm

# Redémarrer Nginx
sudo systemctl restart nginx

# Tester Nginx
sudo nginx -t

# Voir les logs Nginx
sudo tail -f /var/log/nginx/noia_sgm_access.log
sudo tail -f /var/log/nginx/noia_sgm_error.log
```

## ✅ Checklist de déploiement

- [ ] Fichiers téléchargés depuis GitHub (ZIP)
- [ ] Fichier `.env` créé et configuré avec la vraie clé OpenAI
- [ ] FileZilla configuré et connecté au serveur
- [ ] Dossier `/var/www/noia_sgm/` créé sur le serveur
- [ ] Fichiers uploadés via FileZilla
- [ ] Connexion SSH au serveur réussie
- [ ] Script `post_install.sh` exécuté avec succès
- [ ] Service `noia-sgm` démarré (systemctl status = active)
- [ ] Nginx configuré et redémarré
- [ ] SSL installé avec certbot
- [ ] Firewall configuré (optionnel)
- [ ] Application accessible sur https://noia.erelys.fr
- [ ] Test API réussi (curl /health)
- [ ] Interface web fonctionnelle

## 📚 Documentation

- [DEPLOY_FILEZILLA.md](DEPLOY_FILEZILLA.md) - Guide complet
- [DEPLOY_NOIA_ERELYS.md](DEPLOY_NOIA_ERELYS.md) - Guide rapide
- [README.md](README.md) - Documentation technique

---

**Vous n'avez PAS besoin de Git sur le serveur OVH !**
Tout se fait avec FileZilla et SSH. 🎉
