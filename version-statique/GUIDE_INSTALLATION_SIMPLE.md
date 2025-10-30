# 🚀 Installation ULTRA-SIMPLE de NOIA_SGM sur OVH

## ✅ Pas de Python, pas de serveur compliqué !

Cette version de NOIA_SGM fonctionne uniquement avec des fichiers HTML/CSS/JavaScript.
**Vous uploadez et ça fonctionne !**

---

## 📋 Ce dont vous avez besoin

1. ✅ **FileZilla** (télécharger sur https://filezilla-project.org/)
2. ✅ **Accès FTP/SFTP à votre hébergement OVH**
3. ✅ **Une clé API OpenAI** (gratuit pour commencer)

---

## 🎯 Installation en 3 étapes

### Étape 1 : Configurer votre clé API OpenAI

#### 1.1 Obtenir une clé API

1. Aller sur **https://platform.openai.com/signup**
2. Créer un compte ou se connecter
3. Aller dans **API Keys** : https://platform.openai.com/api-keys
4. Cliquer sur **"Create new secret key"**
5. **Copier la clé** (elle commence par `sk-...`)

⚠️ **IMPORTANT** : Configurez des **limites de dépense** dans les paramètres OpenAI !
- Aller sur https://platform.openai.com/account/limits
- Définir une limite mensuelle (ex: 10€ pour commencer)

#### 1.2 Configurer la clé dans l'application

**Méthode simple** : Éditer le fichier `config.js`

1. Ouvrir le fichier `config.js` avec **Notepad++** ou **Bloc-notes**
2. Trouver la ligne :
   ```javascript
   openaiApiKey: 'VOTRE_CLE_API_OPENAI_ICI',
   ```
3. Remplacer `VOTRE_CLE_API_OPENAI_ICI` par votre vraie clé :
   ```javascript
   openaiApiKey: 'sk-proj-abcd1234efgh5678...',
   ```
4. **Sauvegarder** le fichier

---

### Étape 2 : Upload via FileZilla

#### 2.1 Connexion à votre hébergement OVH

1. **Ouvrir FileZilla**

2. **Configurer la connexion** :
   - **Hôte** : `ftp.votre-domaine.fr` ou `sftp://ssh.cluster0XX.hosting.ovh.net`
   - **Utilisateur** : votre login FTP (fourni par OVH)
   - **Mot de passe** : votre mot de passe FTP
   - **Port** : 21 (FTP) ou 22 (SFTP)

3. Cliquer sur **"Connexion rapide"**

#### 2.2 Localiser le dossier web

Sur le serveur (partie droite de FileZilla), naviguer vers le dossier de votre site :
- Souvent : `/www/` ou `/public_html/` ou `/htdocs/`
- Pour un sous-domaine : `/noia/` ou `/noia.erelys.fr/`

#### 2.3 Upload des fichiers

**Partie gauche** (votre ordinateur) : Naviguer vers le dossier `version-statique`

**Glisser-déposer** ces fichiers vers le serveur (partie droite) :

```
✅ index.html
✅ config.js
✅ css/
   └── styles.css
✅ js/
   └── app.js
```

⏱️ L'upload prend 10-30 secondes.

---

### Étape 3 : Tester l'application

1. **Ouvrir votre navigateur**
2. **Aller sur** : `https://noia.erelys.fr` (ou votre domaine)
3. **C'est prêt !** 🎉

---

## ✅ Structure finale sur le serveur

```
/www/noia/  (ou votre dossier web)
├── index.html
├── config.js
├── css/
│   └── styles.css
└── js/
    └── app.js
```

**C'est tout !** Pas besoin de Python, Nginx, systemd, etc.

---

## 🔧 Test rapide

1. Ouvrir https://noia.erelys.fr
2. Poser une question : *"Quelles sont les règles du quorum en conseil municipal ?"*
3. Vérifier que vous recevez une réponse structurée en 4 sections

---

## ⚙️ Personnalisation (optionnel)

### Changer le modèle OpenAI

Éditer `config.js` :

```javascript
// GPT-4 (meilleur mais plus cher)
openaiModel: 'gpt-4',

// GPT-3.5 Turbo (plus rapide, moins cher)
openaiModel: 'gpt-3.5-turbo',
```

### Ajuster les paramètres

```javascript
// Longueur des réponses (en tokens, 1 token ≈ 0.75 mot)
maxTokens: 2000,  // Augmenter pour des réponses plus longues

// Créativité (0.0 = très précis, 1.0 = très créatif)
temperature: 0.3,  // Garder bas pour NOIA_SGM
```

---

## 🔐 Sécurité - IMPORTANT

### ⚠️ Votre clé API est visible dans le code !

Puisque le JavaScript s'exécute dans le navigateur, **n'importe qui peut voir votre clé API** en regardant le code source.

### Comment se protéger :

1. **Créer une clé API dédiée** (une clé uniquement pour NOIA_SGM)
2. **Configurer des limites strictes** sur OpenAI :
   - Limite mensuelle (ex: 10€/mois)
   - Limites de taux (requests per minute)
   - Dashboard : https://platform.openai.com/account/limits

3. **Surveiller l'utilisation** :
   - Vérifier régulièrement : https://platform.openai.com/usage
   - Recevoir des alertes par email

4. **Limiter l'accès au site** (optionnel) :
   - Protéger par mot de passe via le panneau OVH
   - Utiliser un fichier `.htaccess` pour limiter les IP

### Exemple de protection .htaccess (optionnel)

Créer un fichier `.htaccess` dans le même dossier :

```apache
# Protection par mot de passe
AuthType Basic
AuthName "Accès restreint NOIA_SGM"
AuthUserFile /chemin/vers/.htpasswd
Require valid-user
```

---

## 🆘 Dépannage

### Erreur "Invalid API Key"

**Solution** : Vérifier que la clé dans `config.js` est correcte
- La clé doit commencer par `sk-`
- Pas d'espaces avant ou après
- Bien sauvegarder le fichier après modification
- Re-uploader le fichier `config.js` via FileZilla

### Erreur "Rate limit exceeded"

**Solution** : Vous avez fait trop de requêtes
- Attendre quelques minutes
- Vérifier les limites de taux sur OpenAI

### Erreur "Insufficient quota"

**Solution** : Plus de crédits OpenAI
- Ajouter des crédits sur https://platform.openai.com/account/billing
- Vérifier votre limite mensuelle

### La page ne s'affiche pas

**Solutions** :
1. Vérifier que `index.html` est dans le bon dossier
2. Vérifier les permissions des fichiers (755 pour les dossiers, 644 pour les fichiers)
3. Vider le cache du navigateur (Ctrl+F5)

### Les styles ne s'appliquent pas

**Solution** : Vérifier que le dossier `css/` existe et contient `styles.css`

---

## 📊 Coûts OpenAI

### Tarifs approximatifs (GPT-4)

- **Input** : ~0.03$ pour 1000 tokens (~750 mots)
- **Output** : ~0.06$ pour 1000 tokens

### Exemple d'utilisation

- 1 question + 1 réponse ≈ 500-1000 tokens
- **Coût** : ~0.02-0.05$ par échange
- **100 questions/mois** : ~2-5$

### Réduire les coûts

1. Utiliser **GPT-3.5 Turbo** (10x moins cher)
2. Réduire `maxTokens` dans `config.js`
3. Limiter les questions longues

---

## 🔄 Mise à jour de l'application

Pour mettre à jour NOIA_SGM plus tard :

1. Télécharger la nouvelle version
2. **Sauvegarder votre `config.js`** (avec votre clé API)
3. Uploader les nouveaux fichiers via FileZilla
4. Remettre votre clé API dans le nouveau `config.js`
5. Re-uploader `config.js`

---

## 📞 Commandes utiles FileZilla

- **Connexion rapide** : Entrer hôte/user/pass et cliquer "Connexion rapide"
- **Créer un dossier** : Clic droit > Créer le répertoire
- **Permissions** : Clic droit sur un fichier > Permissions fichier
- **Rafraîchir** : F5 ou icône de rafraîchissement

---

## ✅ Checklist finale

- [ ] Clé API OpenAI obtenue
- [ ] Limites de dépense configurées sur OpenAI
- [ ] Fichier `config.js` édité avec la clé API
- [ ] FileZilla installé et configuré
- [ ] Connexion FTP/SFTP réussie
- [ ] Fichiers uploadés (index.html, config.js, css/, js/)
- [ ] Site accessible sur https://noia.erelys.fr
- [ ] Test de question/réponse réussi
- [ ] Historique des conversations fonctionne
- [ ] Mode sombre/clair fonctionne

---

## 🎉 Félicitations !

Votre application NOIA_SGM est maintenant en ligne sur **https://noia.erelys.fr** !

### Fonctionnalités disponibles :

- ✅ Questions/réponses avec IA
- ✅ Réponses structurées en 4 sections
- ✅ Historique des conversations (stocké dans le navigateur)
- ✅ Mode sombre/clair
- ✅ Interface responsive (mobile, tablette, PC)

---

## 📚 Documentation

- **Utilisation** : Posez vos questions administratives, l'IA répond avec références juridiques
- **Historique** : Cliquer sur 📋 pour voir les conversations passées
- **Nouvelle conversation** : Cliquer sur ➕
- **Thème** : Cliquer sur 🌙/☀️

---

## ⚖️ Avertissement

Tous les actes, calculs et documents générés par NOIA_SGM **doivent être validés par le secrétaire général de mairie avant signature ou mise en paiement**.

Cette application est un outil d'assistance et ne remplace pas l'expertise humaine.

---

**🌐 NOIA_SGM - Version statique simplifiée**
*Pas de serveur compliqué, juste upload et c'est parti !*
