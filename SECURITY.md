# Politique de sécurité

## 🔒 Versions supportées

| Version | Support         |
| ------- | --------------- |
| 1.0.x   | ✅ Supportée    |
| < 1.0   | ❌ Non supportée|

## 🛡️ Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité dans NOIA_SGM, merci de nous la signaler de manière responsable.

### ⚠️ NE PAS :
- Créer d'Issue publique sur GitHub
- Divulguer publiquement la vulnérabilité avant sa résolution
- Exploiter la vulnérabilité sur des systèmes en production

### ✅ À FAIRE :
1. Envoyer un email à [votre-email-securite] avec :
   - Description détaillée de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Éventuelles suggestions de correction

2. Attendre notre réponse (sous 48h)

3. Nous laisser le temps de corriger (coordonner la divulgation)

## 🔐 Bonnes pratiques de sécurité

### Pour les administrateurs

#### 1. Configuration serveur

```bash
# Toujours utiliser HTTPS en production
sudo certbot --nginx -d votre-domaine.fr

# Configurer le firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Désactiver l'accès root SSH
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
```

#### 2. Fichier .env

```bash
# Protéger le fichier .env
chmod 600 backend/.env
chown www-data:www-data backend/.env

# Ne JAMAIS commiter le .env
echo "backend/.env" >> .gitignore
```

#### 3. Clé API OpenAI

- ✅ Utiliser une clé dédiée à ce projet
- ✅ Configurer les limites de dépense sur OpenAI
- ✅ Monitorer l'utilisation régulièrement
- ✅ Régénérer la clé périodiquement
- ❌ Ne jamais partager la clé
- ❌ Ne jamais commiter la clé

#### 4. Mises à jour

```bash
# Mettre à jour régulièrement le système
sudo apt update && sudo apt upgrade

# Mettre à jour les dépendances Python
cd /var/www/noia_sgm/backend
source venv/bin/activate
pip list --outdated
pip install -r requirements.txt --upgrade
```

#### 5. Logs et monitoring

```bash
# Surveiller les logs d'accès
sudo tail -f /var/log/nginx/noia_sgm_access.log

# Surveiller les logs d'erreurs
sudo journalctl -u noia-sgm -f

# Configurer une rotation des logs
sudo nano /etc/logrotate.d/noia-sgm
```

#### 6. Sauvegardes

```bash
# Sauvegarder la configuration
tar -czf backup-$(date +%Y%m%d).tar.gz \
    /var/www/noia_sgm/backend/.env \
    /etc/nginx/sites-available/noia-sgm \
    /etc/systemd/system/noia-sgm.service
```

### Pour les développeurs

#### 1. Ne jamais exposer de secrets

```python
# ❌ MAUVAIS
api_key = "sk-1234567890"

# ✅ BON
from app.config import settings
api_key = settings.openai_api_key
```

#### 2. Valider toutes les entrées

```python
# ✅ BON - Validation avec Pydantic
class ChatRequest(BaseModel):
    message: str = Field(..., max_length=2000)
    conversation_history: Optional[List[Message]] = None
```

#### 3. Gérer les erreurs proprement

```python
# ✅ BON
try:
    response = await api_call()
except Exception as e:
    logger.error(f"Erreur API: {str(e)}")
    # Ne pas exposer l'erreur complète à l'utilisateur
    raise HTTPException(500, "Erreur serveur")
```

#### 4. Limiter les requêtes

```python
# Implémenter du rate limiting (exemple avec slowapi)
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat(request: ChatRequest):
    ...
```

## 🔍 Audit de sécurité

### Checklist de déploiement

- [ ] HTTPS activé avec certificat valide
- [ ] Headers de sécurité configurés (Nginx)
- [ ] Fichier .env protégé (chmod 600)
- [ ] Clé API OpenAI dédiée et limitée
- [ ] Firewall configuré
- [ ] SSH sécurisé (pas de root login)
- [ ] Logs actifs et surveillés
- [ ] Sauvegardes configurées
- [ ] Version Python à jour
- [ ] Dépendances à jour
- [ ] Service systemd avec droits limités

### Tests de sécurité

```bash
# Vérifier les headers de sécurité
curl -I https://votre-domaine.fr

# Scanner les vulnérabilités (avec votre autorisation uniquement)
nmap -sV --script vuln votre-domaine.fr

# Vérifier les dépendances Python
pip install safety
safety check -r backend/requirements.txt
```

## 📋 Vulnérabilités connues

Aucune vulnérabilité connue pour le moment.

Les vulnérabilités corrigées seront listées ici avec :
- CVE si applicable
- Version affectée
- Version corrigée
- Niveau de sévérité
- Description

## 🔄 Processus de correction

1. **Réception** : Accusé de réception sous 48h
2. **Évaluation** : Analyse de la vulnérabilité (2-5 jours)
3. **Développement** : Correction dans une branche privée
4. **Test** : Validation de la correction
5. **Release** : Publication de la version corrigée
6. **Divulgation** : Publication coordonnée avec le rapporteur

## 📞 Contact sécurité

Pour toute question de sécurité :
- Email : [votre-email-securite]
- PGP Key : [optionnel]

## 🏆 Hall of Fame

Nous remercions les chercheurs en sécurité qui ont signalé des vulnérabilités de manière responsable :

- [Aucun pour le moment]

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [ANSSI Recommandations](https://www.ssi.gouv.fr/)
- [CNIL Sécurité](https://www.cnil.fr/fr/securite)

---

Dernière mise à jour : 2024
