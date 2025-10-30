# Déploiement NOIA_SGM sur noia.erelys.fr

Guide rapide de déploiement pour le domaine **noia.erelys.fr** hébergé sur OVH.

## 🎯 Informations du projet

- **Domaine** : https://noia.erelys.fr
- **Hébergement** : OVH
- **Méthode** : FileZilla (FTP/SFTP)
- **Localisation serveur** : /var/www/noia_sgm/

## 📋 Checklist pré-déploiement

### 1. Informations à préparer

- [ ] **Clé API OpenAI** : sk-xxxx (OBLIGATOIRE)
- [ ] **Accès SSH OVH** :
  - Hôte : _________________
  - Utilisateur : _________________
  - Mot de passe : _________________
  - Port : 22
- [ ] **FileZilla installé** sur votre ordinateur

### 2. Configuration locale

Avant d'uploader, créer le fichier `backend/.env` :

```env
# Configuration NOIA_SGM pour noia.erelys.fr

OPENAI_API_KEY=sk-votre-vraie-cle-openai-ici
OPENAI_MODEL=gpt-4

HOST=0.0.0.0
PORT=8000
DEBUG=false

CORS_ORIGINS=["https://noia.erelys.fr"]

MAX_TOKENS=2000
TEMPERATURE=0.3
```

⚠️ **CRITIQUE** : Remplacer `sk-votre-vraie-cle-openai-ici` par votre vraie clé !

## 🚀 Déploiement en 10 étapes

### Étape 1 : Connexion FileZilla

```
Protocole : SFTP
Hôte : [fourni par OVH]
Port : 22
Utilisateur : [votre login]
Mot de passe : [votre mot de passe]
```

### Étape 2 : Créer les dossiers

Sur le serveur (côté droit FileZilla) :

```
/var/www/noia_sgm/
├── backend/
├── frontend/
└── deploy/
```

### Étape 3 : Upload des fichiers

Glisser-déposer depuis local (gauche) vers serveur (droite) :

- ✅ Tout le dossier `backend/` (avec `.env` configuré !)
- ✅ Tout le dossier `frontend/`
- ✅ Tout le dossier `deploy/`

### Étape 4 : Connexion SSH

```bash
ssh votre_login@serveur_ovh
```

### Étape 5 : Installation Python

```bash
cd /var/www/noia_sgm/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Étape 6 : Test du backend

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
# Ctrl+C pour arrêter après test
```

### Étape 7 : Service systemd

```bash
sudo cp /var/www/noia_sgm/deploy/noia-sgm.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable noia-sgm
sudo systemctl start noia-sgm
sudo systemctl status noia-sgm
```

### Étape 8 : Configuration Nginx

```bash
sudo cp /var/www/noia_sgm/deploy/nginx.conf /etc/nginx/sites-available/noia-sgm
sudo ln -s /etc/nginx/sites-available/noia-sgm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Étape 9 : SSL Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d noia.erelys.fr
```

Suivre les instructions :
1. Email : votre_email@example.com
2. Accepter les conditions
3. Redirection HTTPS : Oui (option 2)

### Étape 10 : Test final

Ouvrir un navigateur : **https://noia.erelys.fr**

## ✅ Vérifications

### Backend opérationnel

```bash
curl https://noia.erelys.fr/health
# Devrait retourner : {"status":"healthy",...}
```

### API fonctionnelle

```bash
curl -X POST https://noia.erelys.fr/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Test NOIA_SGM"}'
```

### Logs sans erreur

```bash
# Logs backend
sudo journalctl -u noia-sgm -f

# Logs Nginx
sudo tail -f /var/log/nginx/noia_sgm_access.log
```

## 🔧 Commandes de maintenance

### Redémarrer le backend

```bash
sudo systemctl restart noia-sgm
```

### Voir les logs

```bash
sudo journalctl -u noia-sgm -n 100
```

### Mettre à jour le code

Via FileZilla :
1. Uploader les nouveaux fichiers
2. SSH : `sudo systemctl restart noia-sgm`

### Vérifier l'état

```bash
sudo systemctl status noia-sgm
sudo systemctl status nginx
```

## 🆘 Résolution de problèmes

### Erreur 502 Bad Gateway

```bash
# Vérifier le service
sudo systemctl status noia-sgm

# Relancer
sudo systemctl restart noia-sgm
sudo systemctl restart nginx
```

### Backend ne démarre pas

```bash
# Voir les erreurs
sudo journalctl -u noia-sgm -n 50

# Vérifier .env
cat /var/www/noia_sgm/backend/.env

# Tester manuellement
cd /var/www/noia_sgm/backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

### Erreur OpenAI

Vérifier que la clé API est correcte dans `/var/www/noia_sgm/backend/.env`

```bash
cat /var/www/noia_sgm/backend/.env | grep OPENAI_API_KEY
```

### Problème de permissions

```bash
sudo chown -R www-data:www-data /var/www/noia_sgm
sudo chmod 600 /var/www/noia_sgm/backend/.env
```

## 📊 Monitoring

### Espace disque

```bash
df -h
```

### Utilisation CPU/RAM

```bash
htop
# ou
top
```

### Logs des dernières 24h

```bash
sudo journalctl -u noia-sgm --since "24 hours ago"
```

## 🔐 Sécurité

### Firewall (recommandé)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Permissions .env

```bash
sudo chmod 600 /var/www/noia_sgm/backend/.env
```

### Renouvellement SSL

Automatique via certbot, tester :

```bash
sudo certbot renew --dry-run
```

## 📁 Structure finale

```
/var/www/noia_sgm/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   └── routers/
│   ├── venv/
│   ├── .env              ← Clé API ici !
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
└── deploy/
    ├── nginx.conf
    └── noia-sgm.service
```

## 📞 URLs utiles

- **Application** : https://noia.erelys.fr
- **API Health** : https://noia.erelys.fr/health
- **API Chat** : https://noia.erelys.fr/api/chat

## 📚 Documentation complète

- [Guide FileZilla détaillé](DEPLOY_FILEZILLA.md)
- [Documentation complète](README.md)
- [Sécurité](SECURITY.md)

## ✨ Application déployée !

Une fois toutes les étapes complétées, votre application NOIA_SGM sera accessible sur :

🌐 **https://noia.erelys.fr**

---

**Domaine** : noia.erelys.fr
**Hébergement** : OVH
**Version** : 1.0.0
**Date** : 2024
