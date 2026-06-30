# 🚀 Guide de Démarrage Rapide

## ⏱️ 5 minutes pour démarrer Fløøxy's Community

### Étape 1: Installation des dépendances (2 min)

```bash
cd "C:\Users\Waxy360\Desktop\site internet"
npm install
```

Attendez la fin de l'installation...

### Étape 2: Configuration (1 min)

Le fichier `.env` est déjà créé avec les valeurs par défaut.

⚠️ **En production SEULEMENT**, changez `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Puis mettez à jour `.env`:
```env
JWT_SECRET=<votre-clé-ici>
```

### Étape 3: Démarrer le serveur (30 sec)

```bash
npm start
```

Vous devriez voir:
```
🚀 Fløøxy's Community serveur lancé sur http://localhost:3000
📁 Base de données: ./data/users.json
💾 Sauvegarde: ./data/backup
🔒 Sécurité: JWT + Bcrypt activée
```

### Étape 4: Ouvrir le site (30 sec)

Ouvrez `index.html` dans votre navigateur:
- Double-cliquez sur `index.html`, OU
- Utilisez VS Code Live Server

```
http://localhost:5500/index.html   (VS Code)
OU
file:///C:/Users/Waxy360/Desktop/site internet/index.html
```

## ✅ Vérifications

### Le serveur fonctionne?
```bash
curl http://localhost:3000/api/health
```

Réponse attendue:
```json
{
  "status": "OK",
  "message": "Serveur Fløøxy's Community est en ligne"
}
```

### Créer un compte
1. Cliquez sur "S'inscrire"
2. Entrez:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Password: `MyPassword123` (8+ chars, 1 maj, 1 chiffre)
3. Acceptez les conditions
4. Cliquez "S'inscrire"

### Se connecter
1. Cliquez sur "Se connecter"
2. Utilisez les identifiants du compte créé
3. Vous devriez voir votre profil

## 📂 Structure Créée

```
site internet/
├── ✅ index.html          - Page principale
├── ✅ style.css           - Styles
├── ✅ script.js           - Frontend JavaScript
├── ✅ server.js           - Serveur backend
├── ✅ backup.js           - Gestion sauvegarde
├── ✅ package.json        - Dépendances
├── ✅ .env                - Configuration
├── ✅ .env.example        - Template
├── ✅ .gitignore          - Git config
├── ✅ README.md           - Documentation complète
├── ✅ SECURITY.md         - Guide sécurité
├── ✅ QUICKSTART.md       - Ce fichier
└── ✅ data/               - Base de données
    ├── users.json         - Utilisateurs
    └── backup/            - Sauvegardes
```

## 🔧 Commandes Utiles

### Démarrer le serveur
```bash
npm start                    # Production
npm run dev                  # Développement (rechargement auto)
```

### Gestion des sauvegardes
```bash
node backup.js create        # Créer un backup manuel
node backup.js list          # Lister les backups
node backup.js info          # Infos base de données
node backup.js restore file  # Restaurer un backup
```

### Installer/Mettre à jour les dépendances
```bash
npm install
npm update
npm audit fix
```

## ⚠️ Erreurs Communes

### ❌ "Port 3000 already in use"
```bash
# Fermer le processus Node
taskkill /IM node.exe /F

# Ou changer le port dans .env
PORT=3001
```

### ❌ "Cannot find module 'express'"
```bash
npm install
```

### ❌ "CORS policy: No 'Access-Control-Allow-Origin' header"
Vérifiez que votre URL frontend est dans `CORS_ORIGIN` du `.env`

### ❌ "The database file doesn't exist"
Les dossiers `data/` et `data/backup/` doivent exister:
```bash
mkdir data
mkdir data/backup
```

## 🎯 Prochaines Étapes

### Court Terme
- [ ] Tester toutes les fonctionnalités
- [ ] Configurer le thème/branding
- [ ] Ajouter des pages supplémentaires
- [ ] Customiser les couleurs (CSS variables)

### Moyen Terme
- [ ] Ajouter une base de données (MySQL/PostgreSQL)
- [ ] Implémenter la récupération de mot de passe
- [ ] Ajouter la vérification d'email
- [ ] Créer un dashboard utilisateur

### Long Terme
- [ ] Déployer en production
- [ ] Configurer HTTPS/SSL
- [ ] Mettre en place le monitoring
- [ ] Ajouter des features gaming

## 📱 Tester le Design Responsif

### Vérifier le mobile:
1. Ouvrez Chrome DevTools: `F12`
2. Appuyez sur `Ctrl+Shift+M`
3. Sélectionnez "iPhone 12" dans la dropdown

Le site devrait s'adapter correctement au mobile.

## 🔐 Checklist Sécurité

Avant chaque déploiement:

- [ ] ✅ JWT_SECRET changé (production)
- [ ] ✅ NODE_ENV = 'production'
- [ ] ✅ .env NOT sur Git
- [ ] ✅ HTTPS configuré
- [ ] ✅ Backup en place
- [ ] ✅ Logs activés
- [ ] ✅ CORS limité

## 💡 Tips & Tricks

### Déboguer les requêtes API
```javascript
// Dans script.js, avant le fetch:
const API_URL = 'http://localhost:3000/api';
console.log('API URL:', API_URL);
```

### Voir les données sauvegardées
```bash
cat data/users.json
```

### Formater le JSON
```bash
node -e "console.log(JSON.stringify(require('./data/users.json'), null, 2))"
```

### Générer un JWT token
```bash
node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({id: '123'}, 'secret'))"
```

## 📞 Support

Si vous avez besoin d'aide:

1. Vérifiez le README.md pour plus de détails
2. Consultez SECURITY.md pour les questions de sécurité
3. Vérifiez les logs: `npm run logs`
4. Testez avec Postman/Insomnia

## 🎉 Succès!

Si vous avez pu:
- ✅ Installer les dépendances
- ✅ Démarrer le serveur
- ✅ Créer un compte
- ✅ Vous connecter
- ✅ Voir votre profil

**Félicitations! Votre plateforme Fløøxy's Community est opérationnelle! 🚀**

---

**Besoin d'aide?** Consultez le README.md complet pour plus de détails!

