# Guide de démarrage rapide - NOIA_SGM

## 🚀 Démarrage en 5 minutes

### 1. Prérequis

- Serveur Linux avec Python 3.10+
- Clé API OpenAI
- Accès root/sudo

### 2. Installation automatique

```bash
# Cloner le projet
git clone https://github.com/votre-repo/noia-sgm.git
cd noia-sgm

# Configurer la clé API
cp backend/.env.example backend/.env
nano backend/.env  # Ajouter votre OPENAI_API_KEY

# Déployer (en tant que root)
sudo ./deploy/deploy.sh
```

### 3. Configuration minimale

Éditer `backend/.env` :

```env
OPENAI_API_KEY=sk-votre-cle-ici
OPENAI_MODEL=gpt-4
DEBUG=false
```

### 4. Vérification

```bash
# Vérifier que le service tourne
sudo systemctl status noia-sgm

# Tester l'API
curl http://localhost:8000/health

# Voir les logs
sudo journalctl -u noia-sgm -f
```

### 5. Accès

- **Développement** : `http://localhost:8000`
- **Production** : Configurer Nginx et SSL (voir README.md)

## 🔧 Commandes utiles

```bash
# Redémarrer le service
sudo systemctl restart noia-sgm

# Arrêter le service
sudo systemctl stop noia-sgm

# Voir les logs en temps réel
sudo journalctl -u noia-sgm -f

# Tester l'API manuellement
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Comment convoquer un conseil municipal ?"}'
```

## 📊 Test de fonctionnement

1. Ouvrir `http://localhost:8000` dans un navigateur
2. Poser une question : "Quelles sont les règles du quorum en conseil municipal ?"
3. Vérifier que la réponse est structurée en 4 sections

## ⚠️ Problèmes courants

### Le service ne démarre pas

```bash
# Vérifier Python
python3 --version

# Vérifier les dépendances
cd /var/www/noia_sgm/backend
source venv/bin/activate
pip list
```

### Erreur 502 sur Nginx

```bash
# Le backend ne répond pas
sudo systemctl status noia-sgm

# Vérifier le port
netstat -tlnp | grep 8000
```

### Erreur OpenAI

```bash
# Vérifier la clé API
cat backend/.env | grep OPENAI_API_KEY

# Tester la clé manuellement
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## 📖 Documentation complète

Voir [README.md](README.md) pour :
- Configuration avancée
- Sécurité et SSL
- Maintenance et mises à jour
- Dépannage détaillé

## 🎯 Prochaines étapes

1. ✅ Configurer SSL avec Let's Encrypt
2. ✅ Personnaliser le domaine dans Nginx
3. ✅ Activer le monitoring des logs
4. ✅ Configurer les sauvegardes
5. ✅ Tester les cas d'usage métier

---

Pour toute question, consulter le README.md complet ou créer une issue.
