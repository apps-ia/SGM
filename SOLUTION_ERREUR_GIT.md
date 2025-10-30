# GUIDE RAPIDE : Déployer NOIA_SGM sans Git

## ❌ L'erreur "Git n'a pas pu être activé" sur OVH

**C'est normal et ce n'est pas un problème !**

Vous n'avez **PAS BESOIN** de Git sur le serveur OVH.
Utilisez simplement FileZilla pour uploader les fichiers.

## ✅ Solution : Télécharger et uploader avec FileZilla

### 🎯 Méthode la plus simple

1. **Télécharger le code**
   - Sur GitHub, cliquer sur **"Code"** → **"Download ZIP"**
   - Extraire le ZIP sur votre ordinateur

2. **Configurer le .env**
   ```bash
   # Copier le fichier exemple
   backend/.env.example → backend/.env

   # Éditer backend/.env avec votre clé OpenAI :
   OPENAI_API_KEY=sk-votre-vraie-cle-ici
   ```

3. **Upload via FileZilla**
   - Connexion SFTP sur votre serveur OVH
   - Créer `/var/www/noia_sgm/`
   - Glisser-déposer : `backend/`, `frontend/`, `deploy/`

4. **Configuration serveur (SSH)**
   ```bash
   ssh votre_login@serveur
   cd /var/www/noia_sgm
   sudo bash deploy/post_install.sh
   sudo certbot --nginx -d noia.erelys.fr
   ```

5. **Accéder à l'application**
   - https://noia.erelys.fr ✨

## 📖 Documentation complète

- **[DEPLOY_NO_GIT.md](DEPLOY_NO_GIT.md)** ← Guide détaillé étape par étape
- **[DEPLOY_FILEZILLA.md](DEPLOY_FILEZILLA.md)** ← Guide FileZilla complet
- **[DEPLOY_NOIA_ERELYS.md](DEPLOY_NOIA_ERELYS.md)** ← Checklist rapide

---

**Pas de Git nécessaire !** Tout se fait avec FileZilla. 🚀
