# NOIA_SGM - Version Statique Simplifiée

## 🎯 Qu'est-ce que c'est ?

Cette version de NOIA_SGM est **100% statique** : elle ne nécessite **aucun serveur backend, aucune installation Python, aucune configuration compliquée**.

**Vous uploadez les fichiers via FTP et ça fonctionne !**

---

## ✅ Avantages

- ✅ **Installation ultra-simple** : Upload FTP et c'est prêt
- ✅ **Pas de Python** à installer sur le serveur
- ✅ **Pas de configuration** Nginx, systemd, etc.
- ✅ **Fonctionne sur tout hébergement** (OVH mutualisé, etc.)
- ✅ **Mise à jour facile** : Re-uploader les fichiers
- ✅ **Pas de serveur à maintenir**

---

## ⚠️ Inconvénients et Sécurité

### Risque de sécurité IMPORTANT

Cette version appelle l'API OpenAI **directement depuis le navigateur**.
Cela signifie que **votre clé API est visible** dans le code JavaScript accessible à tous.

### Conséquences

❌ **N'importe qui** peut :
- Voir votre clé API en affichant le code source
- Copier la clé et l'utiliser ailleurs
- Consommer vos crédits OpenAI

### Comment se protéger ?

1. **Créer une clé API dédiée** uniquement pour NOIA_SGM
   - https://platform.openai.com/api-keys

2. **Configurer des LIMITES STRICTES** sur OpenAI :
   - Limite mensuelle (ex: 10€/mois maximum)
   - Limite de taux (requests per minute)
   - Dashboard : https://platform.openai.com/account/limits

3. **Surveiller l'utilisation** régulièrement :
   - https://platform.openai.com/usage
   - Configurer des alertes email

4. **Protéger l'accès au site** (optionnel) :
   - Mot de passe via .htaccess
   - Restriction par IP
   - Authentification OVH

---

## 🆚 Version Statique vs Version Complète

| Critère | Version Statique | Version Complète |
|---------|------------------|------------------|
| **Installation** | ⭐⭐⭐⭐⭐ Simple | ⭐⭐ Complexe |
| **Sécurité** | ⭐⭐ Clé visible | ⭐⭐⭐⭐⭐ Clé protégée |
| **Hébergement** | Mutualisé OK | VPS/Dédié requis |
| **Configuration** | Éditer 1 fichier | Multiple étapes |
| **Maintenance** | Aucune | Serveur à maintenir |
| **Coût** | Hébergement basique | Hébergement avancé |

### Quand utiliser la version statique ?

✅ **Utiliser la version statique si** :
- Vous avez un hébergement mutualisé (pas d'accès SSH)
- Vous voulez une installation simple et rapide
- Vous êtes le seul utilisateur ou un petit groupe
- Vous pouvez configurer des limites strictes OpenAI
- Vous acceptez le risque de sécurité

❌ **NE PAS utiliser la version statique si** :
- L'application est publique avec beaucoup d'utilisateurs
- Vous ne pouvez pas surveiller l'utilisation OpenAI
- La sécurité de la clé API est critique
- Vous avez accès à un VPS/serveur dédié

### Pour une sécurité maximale

➡️ Utilisez la **version complète** avec backend Python (FastAPI)
- La clé API reste sur le serveur
- Contrôle d'accès possible
- Rate limiting possible
- Logs d'utilisation

Documentation : [../README.md](../README.md)

---

## 📁 Contenu du dossier

```
version-statique/
├── index.html           # Page principale
├── config.js            # Configuration (CLÉ API ICI !)
├── css/
│   └── styles.css       # Styles de l'interface
├── js/
│   └── app.js           # Logique de l'application
├── README.md            # Ce fichier
└── GUIDE_INSTALLATION_SIMPLE.md  # Guide d'installation
```

---

## 🚀 Installation rapide

### 1. Configurer la clé API

Éditer `config.js` :

```javascript
const NOIA_CONFIG = {
    openaiApiKey: 'sk-votre-cle-api-ici',  // ⚠️ MODIFIER ICI
    openaiModel: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.3,
};
```

### 2. Upload via FileZilla

- Connecter FileZilla à votre hébergement OVH
- Naviguer vers le dossier web (`/www/`, `/public_html/`, etc.)
- Glisser-déposer tous les fichiers

### 3. Accéder à l'application

Ouvrir : `https://noia.erelys.fr`

---

## 📖 Documentation complète

Voir **[GUIDE_INSTALLATION_SIMPLE.md](GUIDE_INSTALLATION_SIMPLE.md)** pour :
- Instructions détaillées étape par étape
- Obtenir une clé API OpenAI
- Configurer FileZilla
- Upload des fichiers
- Configuration de sécurité
- Dépannage
- Coûts OpenAI

---

## 🔒 Recommandations de sécurité

### Obligatoire

1. ✅ **Créer une clé API dédiée** sur OpenAI
2. ✅ **Configurer une limite mensuelle** (ex: 10€)
3. ✅ **Surveiller l'utilisation** hebdomadairement

### Fortement recommandé

4. ⭐ **Limiter l'accès au site** (mot de passe, IP whitelist)
5. ⭐ **Utiliser GPT-3.5-Turbo** au lieu de GPT-4 (moins cher)
6. ⭐ **Configurer des alertes** OpenAI

### Optionnel mais conseillé

7. 💡 **Révoquer et régénérer** la clé régulièrement
8. 💡 **Utiliser un sous-domaine** dédié (noia.erelys.fr)
9. 💡 **Monitorer les logs** d'accès du site

---

## 💰 Coûts estimés

### Hébergement OVH

- Mutualisé OVH : ~3-10€/mois
- Inclut : FTP, domaine, SSL

### OpenAI (avec GPT-4)

- ~0.03-0.05$ par question/réponse
- **10 questions/jour** : ~1-2$/mois
- **100 questions/jour** : ~15-30$/mois

### Total estimé

- **Petit usage** (10 q/jour) : ~5-15€/mois
- **Usage moyen** (50 q/jour) : ~20-40€/mois

### Réduire les coûts

- Utiliser **GPT-3.5-Turbo** (10x moins cher !)
- Réduire `maxTokens` à 1000
- Limiter le nombre de questions

---

## 🛠️ Maintenance

### Mise à jour de l'application

1. Sauvegarder votre `config.js` (contient votre clé)
2. Télécharger la nouvelle version
3. Uploader les nouveaux fichiers via FileZilla
4. Restaurer votre clé API dans `config.js`

### Surveillance

- **Hebdomadaire** : Vérifier l'utilisation OpenAI
- **Mensuelle** : Vérifier les coûts
- **Si anomalie** : Révoquer la clé immédiatement

---

## 🆘 Support

### Problèmes courants

1. **"Invalid API Key"**
   - Vérifier la clé dans `config.js`
   - Re-créer une clé sur OpenAI
   - Re-uploader le fichier

2. **"Rate limit exceeded"**
   - Attendre quelques minutes
   - Augmenter les limites sur OpenAI

3. **"Insufficient quota"**
   - Ajouter des crédits OpenAI
   - Vérifier la limite mensuelle

### Documentation

- [GUIDE_INSTALLATION_SIMPLE.md](GUIDE_INSTALLATION_SIMPLE.md)
- [OpenAI Documentation](https://platform.openai.com/docs)

---

## ⚖️ Avertissement légal

**Tous les actes générés par NOIA_SGM doivent être validés par le secrétaire général de mairie avant signature.**

Cette application est un outil d'assistance et ne remplace pas l'expertise humaine.

---

## 📄 Licence

MIT License - Voir le fichier LICENSE dans le dossier parent.

---

**NOIA_SGM - Version Statique Simplifiée**
*Installation en 3 étapes - Fonctionne sur tout hébergement*

⚠️ **Attention** : Lisez les recommandations de sécurité avant utilisation !
