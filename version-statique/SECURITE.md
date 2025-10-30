# 🔒 Sécurité - NOIA_SGM Version Statique

## ⚠️ AVERTISSEMENT CRITIQUE

Cette version de NOIA_SGM expose **votre clé API OpenAI dans le code JavaScript**.

**N'importe qui peut** :
- Voir votre clé en affichant le code source de la page
- Copier cette clé et l'utiliser ailleurs
- Consommer vos crédits OpenAI à votre insu

---

## 🛡️ Mesures de protection OBLIGATOIRES

### 1. Créer une clé API dédiée

✅ **À FAIRE** :
1. Aller sur https://platform.openai.com/api-keys
2. Créer une **nouvelle clé** spécifiquement pour NOIA_SGM
3. Nommer la clé : "NOIA_SGM - noia.erelys.fr"
4. **Ne pas utiliser** votre clé API principale !

❌ **NE JAMAIS** :
- Utiliser une clé partagée avec d'autres applications
- Utiliser la même clé en production et en test

---

### 2. Configurer des limites strictes

✅ **OBLIGATOIRE** sur https://platform.openai.com/account/limits :

#### Limite mensuelle (Hard limit)
```
Usage limits :
   Montant maximum par mois : 10€ (ajuster selon vos besoins)
```

Si vous dépassez cette limite, l'API s'arrête automatiquement.

#### Limites de taux (Rate limits)

Si disponible, configurer :
- **Requests per minute (RPM)** : 10-20 max
- **Tokens per minute (TPM)** : 50,000 max

#### Alertes email

Activer les alertes :
- ✅ Alerte à 50% du quota
- ✅ Alerte à 80% du quota
- ✅ Alerte à 100% du quota

---

### 3. Surveiller l'utilisation

✅ **Vérification hebdomadaire** :
1. Aller sur https://platform.openai.com/usage
2. Vérifier la consommation
3. Vérifier qu'il n'y a pas de pics anormaux

#### Signes d'utilisation non autorisée :

⚠️ **Alertes** :
- Consommation inhabituelle (ex: 100 requêtes en 1 heure)
- Utilisation durant la nuit ou weekend
- Augmentation soudaine des coûts

🚨 **Action immédiate** :
1. Révoquer la clé API sur OpenAI
2. Créer une nouvelle clé
3. Mettre à jour `config.js`
4. Re-uploader le fichier

---

## 🔐 Mesures de protection supplémentaires

### 4. Limiter l'accès au site (FORTEMENT RECOMMANDÉ)

#### Option A : Protection par mot de passe (.htaccess)

1. Créer un fichier `.htpasswd` :
   - Générateur : https://www.web2generators.com/apache-tools/htpasswd-generator
   - Utilisateur : admin
   - Mot de passe : (choisir un mot de passe fort)

2. Uploader `.htpasswd` **en dehors** du dossier web

3. Créer/éditer `.htaccess` :
   ```apache
   AuthType Basic
   AuthName "Accès restreint - NOIA_SGM"
   AuthUserFile /chemin/absolu/.htpasswd
   Require valid-user
   ```

4. Uploader `.htaccess` dans le dossier de NOIA_SGM

#### Option B : Restriction par IP

Si vous avez une IP fixe :

`.htaccess` :
```apache
Order Deny,Allow
Deny from all
Allow from 123.456.789.0  # Votre IP
```

Trouver votre IP : https://www.whatismyip.com/

#### Option C : Via le panneau OVH

1. Se connecter à l'espace client OVH
2. Hébergement → Protection d'accès
3. Activer la protection par mot de passe
4. Choisir le répertoire à protéger

---

### 5. Utiliser GPT-3.5-Turbo au lieu de GPT-4

**Réduire les coûts** de 90% :

Dans `config.js` :
```javascript
openaiModel: 'gpt-3.5-turbo',  // Au lieu de 'gpt-4'
```

**Avantages** :
- ✅ 10x moins cher
- ✅ Plus rapide
- ✅ Limite les dégâts en cas d'utilisation non autorisée

**Inconvénients** :
- ⚠️ Réponses légèrement moins précises
- ⚠️ Moins bon sur des questions complexes

---

### 6. Réduire maxTokens

Limiter la longueur des réponses :

Dans `config.js` :
```javascript
maxTokens: 1000,  // Au lieu de 2000
```

**Effet** : Réponses plus courtes = moins de coûts

---

### 7. Logs et monitoring

#### Vérifier les logs d'accès OVH

1. Panneau OVH → Hébergement → Statistiques
2. Vérifier les pics de trafic
3. Identifier les IP suspectes

#### Configurer Google Analytics (optionnel)

Pour suivre l'utilisation :
1. Créer un compte Google Analytics
2. Ajouter le code de suivi dans `index.html`
3. Surveiller les visiteurs

---

## 📊 Estimation des coûts et risques

### Scénario 1 : Utilisation normale

**Vous seul utilisez NOIA_SGM :**
- 10 questions/jour
- GPT-4
- Coût : ~1-2$/mois (1-2€)

**Risque** : ⭐ Faible

---

### Scénario 2 : Découverte de la clé

**Quelqu'un trouve votre clé et l'utilise modérément :**
- 100 questions/jour
- GPT-4
- Coût : ~15-30$/mois (15-30€)

**Risque** : ⭐⭐⭐ Moyen

**Protection** : Limite mensuelle à 10€

---

### Scénario 3 : Abus massif

**Bot automatique utilise votre clé :**
- 10,000 questions/jour
- GPT-4
- Coût potentiel : ~1,500$/mois (1,500€)

**Risque** : ⭐⭐⭐⭐⭐ Critique !

**Protection** :
- ✅ Limite mensuelle (bloque à 10€)
- ✅ Rate limits (bloque après X requêtes/min)
- ✅ Surveillance hebdomadaire

---

## ✅ Checklist de sécurité

### Avant la mise en ligne

- [ ] Créer une clé API dédiée à NOIA_SGM
- [ ] Configurer une limite mensuelle (10€ recommandé)
- [ ] Configurer les rate limits si disponibles
- [ ] Activer les alertes email OpenAI
- [ ] Tester l'application en local d'abord

### Après la mise en ligne

- [ ] Protéger l'accès au site (.htaccess ou OVH)
- [ ] Vérifier que la clé fonctionne
- [ ] Tester avec 2-3 questions
- [ ] Vérifier l'utilisation sur OpenAI

### Maintenance hebdomadaire

- [ ] Vérifier l'utilisation OpenAI
- [ ] Vérifier les coûts
- [ ] Vérifier les logs d'accès au site
- [ ] Pas de pic anormal ?

### Maintenance mensuelle

- [ ] Vérifier la facture OpenAI
- [ ] Régénérer la clé API (optionnel mais recommandé)
- [ ] Mettre à jour NOIA_SGM si nouvelle version

---

## 🚨 Que faire en cas de problème ?

### Suspicion d'utilisation non autorisée

1. **Révoquer immédiatement** la clé API :
   - https://platform.openai.com/api-keys
   - Cliquer sur "Revoke" sur la clé

2. **Créer une nouvelle clé**

3. **Mettre à jour** `config.js` avec la nouvelle clé

4. **Re-uploader** `config.js` via FileZilla

5. **Activer une protection** d'accès (.htaccess)

6. **Analyser** les logs pour identifier la source

---

### Facture OpenAI élevée

1. **Vérifier** l'utilisation sur https://platform.openai.com/usage

2. **Identifier** les pics de consommation

3. **Révoquer** la clé si abus

4. **Contacter** le support OpenAI pour contester si frauduleux

5. **Renforcer** la protection

---

### Clé API compromise

Si vous êtes certain que votre clé a été compromise :

1. ❌ **Révoquer** immédiatement
2. ✅ **Créer** une nouvelle clé
3. 🔒 **Activer** la protection d'accès
4. 📊 **Surveiller** étroitement pendant 1 semaine
5. 💬 **Contacter** OpenAI si charges frauduleuses

---

## 💡 Alternatives plus sécurisées

Si la sécurité est critique pour vous :

### Option 1 : Version avec backend

Utiliser la **version complète** de NOIA_SGM :
- Backend Python (FastAPI)
- Clé API protégée sur le serveur
- Contrôle d'accès possible

Documentation : [../README.md](../README.md)

### Option 2 : Proxy avec Cloudflare Workers

Créer un proxy serverless :
- Clé API dans Cloudflare Workers
- Gratuit jusqu'à 100,000 requêtes/jour
- Guide : https://developers.cloudflare.com/workers/

### Option 3 : Azure/AWS API Gateway

Utiliser un service cloud comme passerelle :
- Azure API Management
- AWS API Gateway
- Protège la clé OpenAI

---

## 📚 Ressources

### Sécurité OpenAI
- Gestion des clés : https://platform.openai.com/api-keys
- Limites : https://platform.openai.com/account/limits
- Utilisation : https://platform.openai.com/usage

### Protection .htaccess
- Générateur .htpasswd : https://www.web2generators.com/apache-tools/htpasswd-generator
- Documentation Apache : https://httpd.apache.org/docs/2.4/howto/auth.html

### Sécurité générale
- OWASP Top 10 : https://owasp.org/www-project-top-ten/
- Guide sécurité web : https://www.ssi.gouv.fr/

---

## ⚖️ Conclusion

La version statique de NOIA_SGM est **simple à installer** mais **moins sécurisée**.

**Utilisez-la uniquement si** :
- ✅ Vous comprenez les risques
- ✅ Vous mettez en place les protections
- ✅ Vous surveillez régulièrement
- ✅ Vous avez configuré des limites strictes

**Pour une utilisation en production avec plusieurs utilisateurs**, préférez la **version complète avec backend**.

---

**🔒 La sécurité est votre responsabilité !**

En cas de doute, contactez un professionnel de la sécurité informatique.
