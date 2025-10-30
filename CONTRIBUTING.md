# Contribuer à NOIA_SGM

Merci de votre intérêt pour contribuer à NOIA_SGM ! Ce document fournit des directives pour contribuer au projet.

## 🎯 Objectifs du projet

NOIA_SGM vise à fournir une assistance administrative de qualité aux petites communes françaises en s'appuyant sur :
- Des sources officielles uniquement
- Des réponses structurées et vérifiables
- Une interface simple et accessible
- Le respect de la vie privée et du RGPD

## 🤝 Comment contribuer

### Rapporter un bug

Si vous trouvez un bug :

1. Vérifiez qu'il n'a pas déjà été signalé dans les Issues
2. Créez une nouvelle Issue avec :
   - Un titre descriptif
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement observé
   - Votre environnement (OS, Python, navigateur)
   - Les logs pertinents

### Proposer une amélioration

Pour proposer une nouvelle fonctionnalité :

1. Créez une Issue décrivant :
   - Le problème que cela résout
   - La solution proposée
   - Les alternatives envisagées
   - L'impact sur les utilisateurs

2. Attendez les retours avant de commencer le développement

### Soumettre une Pull Request

1. **Fork** le projet
2. **Créez une branche** : `git checkout -b feature/ma-fonctionnalite`
3. **Développez** en suivant les standards du projet
4. **Testez** vos modifications
5. **Commitez** : `git commit -m "feat: ajouter ma fonctionnalité"`
6. **Pushez** : `git push origin feature/ma-fonctionnalite`
7. **Créez une Pull Request**

## 📋 Standards de code

### Backend (Python)

- Suivre **PEP 8**
- Utiliser **type hints** quand possible
- Documenter les fonctions avec des **docstrings**
- Écrire des **tests** pour les nouvelles fonctionnalités

Exemple :

```python
def ma_fonction(param: str) -> dict:
    """
    Description de la fonction

    Args:
        param: Description du paramètre

    Returns:
        Description du retour
    """
    return {"resultat": param}
```

### Frontend (JavaScript)

- Utiliser **ES6+**
- Commenter les fonctions complexes
- Suivre la structure existante
- Tester sur plusieurs navigateurs

### CSS

- Utiliser les **variables CSS** existantes
- Maintenir la compatibilité **mode sombre/clair**
- Tester le **responsive** (mobile, tablette, desktop)

## 🧪 Tests

Avant de soumettre une PR :

```bash
# Tests Python (backend)
cd backend
source venv/bin/activate
pytest test_api.py -v

# Test manuel
./test_local.sh

# Vérifier le code
pylint app/
```

## 📝 Convention de commits

Utiliser la convention **Conventional Commits** :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, pas de changement de code
- `refactor:` Refactoring
- `test:` Ajout de tests
- `chore:` Tâches de maintenance

Exemples :
```
feat: ajouter export PDF des réponses
fix: corriger l'affichage du mode sombre
docs: améliorer le README
```

## 🔒 Sécurité

Si vous découvrez une vulnérabilité de sécurité :

1. **NE PAS** créer d'Issue publique
2. Envoyer un email à [contact sécurité]
3. Attendre la résolution avant publication

## 📚 Améliorer la documentation

Toute amélioration de la documentation est la bienvenue :

- README.md : Documentation générale
- QUICK_START.md : Guide rapide
- Commentaires dans le code
- Exemples d'utilisation
- Tutoriels

## 🎨 Améliorer l'interface

Pour l'interface utilisateur :

- Respecter le design épuré et institutionnel
- Maintenir l'accessibilité
- Tester sur différents appareils
- Conserver la lisibilité

## 🌍 Traductions

Actuellement, NOIA_SGM est en français uniquement (public cible francophone). Les traductions ne sont pas une priorité.

## ⚖️ Sources juridiques

Lors de l'ajout de contenu juridique :

- Toujours citer les sources officielles
- Vérifier la version en vigueur des textes
- Indiquer les dates de référence
- Préciser quand vérification humaine est nécessaire

## 🚫 Ce qui ne sera pas accepté

- Code malveillant ou backdoors
- Collecte de données non nécessaires
- Tracking ou analytics intrusifs
- Fonctionnalités payantes ou freemium
- Publicité
- Dépendances non nécessaires ou propriétaires

## 📞 Questions

Pour toute question :

- Consultez d'abord la documentation
- Cherchez dans les Issues existantes
- Créez une nouvelle Issue si nécessaire

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

## 🙏 Remerciements

Merci à tous les contributeurs qui aident à améliorer NOIA_SGM pour les petites communes françaises !

---

**Note** : Ces directives peuvent évoluer. Merci de les consulter régulièrement.
