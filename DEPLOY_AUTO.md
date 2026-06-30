# 🚀 DEPLOYMENT AUTOMATIQUE - FLOOXY

**Ce fichier permet à Claude de redéployer le site automatiquement sur Netlify sans intervention manuelle.**

---

## 📋 INFORMATIONS DE DÉPLOIEMENT

### Comptes & Repos
- **GitHub Pseudo**: Howaitorufu
- **Repo GitHub**: flooxy-website
- **Repo URL**: https://github.com/Howaitorufu/flooxy-website.git
- **Branch**: main

### Netlify
- **Projet Netlify**: hilarious-moonbeam-82c8e9
- **Domaine temporaire**: https://hilarious-moonbeam-82c8e9.netlify.app
- **Domaine final**: https://flooxy.eu.org

### EU.org
- **Domaine**: flooxy.eu.org
- **Identifiant**: DM2471-FREE
- **Nameservers Netlify**: 
  - dns1.netlify.com
  - dns2.netlify.com

### Email
- **Email GitHub/Netlify**: madouxdylan@gmail.com

---

## 🔄 PROCESSUS DE REDÉPLOIEMENT AUTOMATIQUE

### ÉTAPE 1️⃣: Vérifier les fichiers modifiés
```bash
cd "C:\Users\Waxy360\Desktop\site internet"
git status
```

### ÉTAPE 2️⃣: Tester localement (IMPORTANT!)
```bash
npm start
```
✅ Le serveur doit démarrer sans erreur sur http://localhost:3000

### ÉTAPE 3️⃣: Installer/mettre à jour dépendances
```bash
npm install
npm audit fix
```

### ÉTAPE 4️⃣: Vérifier package.json
Les versions doivent être compatibles Netlify:
- express: ^4.18.2 ✅
- bcrypt: ^5.1.0 ✅
- jsonwebtoken: ^9.0.0 ✅ (PAS 9.1.2!)
- dotenv: ^16.0.3 ✅
- cors: ^2.8.5 ✅
- body-parser: ^1.20.2 ✅
- validator: ^13.9.0 ✅

### ÉTAPE 5️⃣: Commit et Push
```bash
git add .
git commit -m "Auto-deploy: [description de la modification]"
git push origin main
```

### ÉTAPE 6️⃣: Vérifier le déploiement Netlify
- **Aller sur**: https://app.netlify.com
- **Vérifier le build**: Production deploys doit être GREEN ✅
- **Attendre**: 2-5 minutes pour la compilation
- **Vérifier l'URL**: https://hilarious-moonbeam-82c8e9.netlify.app

### ÉTAPE 7️⃣: Vérifier sur le domaine final
```bash
curl https://flooxy.eu.org
```
Ou ouvrir dans le navigateur (attendre 5 min pour DNS)

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT

- [ ] Code modifié et testé localement
- [ ] `npm install` réussi
- [ ] `npm start` fonctionne
- [ ] `.env` NE doit PAS être commité
- [ ] `node_modules/` NE doit PAS être commité
- [ ] `.gitignore` contient les bons fichiers
- [ ] `package.json` a les versions correctes
- [ ] `netlify.toml` est présent et correct
- [ ] Git remote pointe vers Howaitorufu/flooxy-website

---

## 🔒 FICHIERS CRITIQUES

**Ne jamais modifier:**
- `.env` (local seulement)
- `node_modules/` (généré par npm)

**Toujours vérifier avant push:**
- `package.json` (versions)
- `netlify.toml` (config build)
- `.gitignore` (protection données)

**À mettre à jour régulièrement:**
- `index.html` (frontend)
- `style.css` (styles)
- `script.js` (logique frontend)
- `server.js` (backend)

---

## 🐛 DÉPANNAGE RAPIDE

### ❌ "npm install" échoue
**Solution:**
```bash
rm package-lock.json
npm cache clean --force
npm install
```

### ❌ Netlify deploy fail
**Vérifier:**
- Package.json versions correctes
- Pas de `package-lock.json` avec mauvaises versions
- `.gitignore` ne bloque pas les fichiers critiques

### ❌ Site ne se met pas à jour
**Solutions:**
1. Vider le cache: Ctrl+Shift+Suppr
2. Attendre 5 minutes (DNS)
3. Vérifier sur Netlify que le build est GREEN

### ❌ "Branch not found"
**Solution:**
```bash
git branch -M main
git push -u origin main
```

---

## 📊 STRUCTURE POUR REDÉPLOIEMENT AUTOMATIQUE

Quand Claude redéploie, il doit:

1. **CD au dossier**: `C:\Users\Waxy360\Desktop\site internet`
2. **Vérifier les changements**: Quels fichiers ont été modifiés?
3. **Tester localement**: Lancer `npm start` et vérifier
4. **Installer dépendances**: `npm install`
5. **Commit tous les fichiers**: `git add .`
6. **Créer un commit descriptif**: `git commit -m "description"`
7. **Pousser sur GitHub**: `git push origin main`
8. **Attendre Netlify**: 2-5 minutes
9. **Confirmer le déploiement**: Vérifier que le site est en ligne

---

## 🎯 COMMANDE RAPIDE POUR CLAUDE

**Pour redéployer TOUT automatiquement:**

```bash
# 1. CD au projet
cd "C:\Users\Waxy360\Desktop\site internet"

# 2. Vérifier les changements
git status

# 3. Installer/mettre à jour
npm install

# 4. Tester (optionnel pour tests rapides)
# npm start (Ctrl+C pour arrêter)

# 5. Push vers GitHub
git add .
git commit -m "Auto-deploy: [description]"
git push origin main

# 6. Attendre 2-5 min et vérifier:
# https://hilarious-moonbeam-82c8e9.netlify.app
# https://flooxy.eu.org (après DNS propagation)
```

---

## 🔐 SECRETS & CONFIGURATION

### Variables à configurer sur Netlify (pas besoin, par défaut):
- `JWT_SECRET`: Défini dans netlify.toml
- `NODE_ENV`: production (défini dans netlify.toml)

### Fichier .env (LOCAL SEULEMENT):
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

⚠️ **JAMAIS commitez .env sur GitHub!**

---

## 📅 PLANNING DE DÉPLOIEMENT

| Étape | Temps | Action |
|-------|-------|--------|
| Test local | 1 min | `npm start` → vérifier |
| npm install | 1 min | Installer dépendances |
| Git commit | 1 min | `git push origin main` |
| Netlify build | 2-5 min | Attendre build |
| DNS propagation | 5-30 min | Attendre flooxy.eu.org |
| Vérification | 1 min | Tester URL |

**TOTAL: 10-40 minutes pour deployment complet**

---

## 🚀 RÉSUMÉ POUR CLAUDE

**Quand Dylan dit "redéploie le site":**

1. Aller au dossier du projet
2. Vérifier les changements avec `git status`
3. Faire `npm install` (pour installer nouvelles dépendances)
4. Faire `git add .`
5. Faire `git commit -m "Auto-deploy: description"`
6. Faire `git push origin main`
7. Dire à Dylan: "✅ Code pushé! Netlify redéploie en 2-5 min"
8. Après 5 min, vérifier que https://flooxy.eu.org marche

---

## 📞 CONTACTS & INFOS

- **Email**: madouxdylan@gmail.com
- **GitHub**: https://github.com/Howaitorufu
- **Netlify Dashboard**: https://app.netlify.com
- **Domaine**: flooxy.eu.org
- **EU.org Account**: DM2471-FREE

---

## ✅ STATUS ACTUEL

| Item | Status | Notes |
|------|--------|-------|
| **GitHub Repo** | ✅ Created | flooxy-website |
| **Netlify Project** | ✅ Connected | hilarious-moonbeam-82c8e9 |
| **npm install** | ✅ Works | 170 packages |
| **npm start** | ✅ Works | Port 3000 |
| **Netlify Deploy** | ✅ Live | Build green |
| **Frontend Site** | ✅ Complete | index.html + CSS + JS |
| **Admin Dashboard** | ✅ Complete | admin.html + full management |
| **Backend API** | ✅ Complete | 15+ endpoints |
| **Domaine EU.org** | ⏳ Pending | À configurer DNS |
| **SSL Certificate** | ✅ Auto | Netlify + Acme |

---

## 🎮 PAGES DISPONIBLES

- 📄 **index.html** - Site principal (Jeux, Communauté, Forum, Contact)
- 🔐 **admin.html** - Dashboard Admin (Gestion complète)

### Access Admin:
1. Se connecter via index.html
2. Aller à `admin.html` (sécurisé par JWT)
3. Accès complet à tous les outils d'administration

---

**Créé le**: 2026-06-30  
**Version**: 1.0  
**Mainteneur**: Claude Code  
**Pour**: Redéploiement automatique Flooxy

