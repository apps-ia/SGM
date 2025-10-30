# Fichiers de déploiement NOIA_SGM

Ce dossier contient les fichiers de configuration pour déployer NOIA_SGM sur un serveur.

## 📁 Fichiers

### nginx.conf
Configuration Nginx pour le domaine **noia.erelys.fr** incluant :
- Redirection HTTP → HTTPS
- Configuration SSL/TLS
- Headers de sécurité
- Proxy vers le backend (port 8000)
- Gestion des fichiers statiques

**Usage** :
```bash
sudo cp nginx.conf /etc/nginx/sites-available/noia-sgm
sudo ln -s /etc/nginx/sites-available/noia-sgm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### noia-sgm.service
Fichier de service systemd pour gérer le backend automatiquement.

**Usage** :
```bash
sudo cp noia-sgm.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable noia-sgm
sudo systemctl start noia-sgm
```

### deploy.sh
Script de déploiement automatique complet (installation depuis zéro).

**Usage** :
```bash
sudo ./deploy.sh
```

### post_install.sh ⭐
Script à exécuter APRÈS avoir uploadé les fichiers via FileZilla.
Configure automatiquement l'environnement Python, les services et Nginx.

**Usage** :
```bash
cd /var/www/noia_sgm
sudo bash deploy/post_install.sh
```

## 🚀 Déploiement rapide avec FileZilla

### 1. Upload via FileZilla
Uploader tous les fichiers du projet vers `/var/www/noia_sgm/`

### 2. Exécuter le script post-installation
```bash
ssh votre_login@serveur
cd /var/www/noia_sgm
sudo bash deploy/post_install.sh
```

### 3. Installer SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d noia.erelys.fr
```

### 4. Accéder à l'application
https://noia.erelys.fr

## 📝 Notes

- **Domaine configuré** : noia.erelys.fr
- **Port backend** : 8000
- **Localisation serveur** : /var/www/noia_sgm/
- **Service** : noia-sgm.service
- **Utilisateur** : www-data

## 🔧 Commandes utiles

```bash
# Voir l'état du service
sudo systemctl status noia-sgm

# Redémarrer le backend
sudo systemctl restart noia-sgm

# Voir les logs
sudo journalctl -u noia-sgm -f

# Tester Nginx
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 📚 Documentation

Voir les guides complets :
- [DEPLOY_FILEZILLA.md](../DEPLOY_FILEZILLA.md) - Guide complet FileZilla
- [DEPLOY_NOIA_ERELYS.md](../DEPLOY_NOIA_ERELYS.md) - Guide spécifique noia.erelys.fr
- [README.md](../README.md) - Documentation générale
