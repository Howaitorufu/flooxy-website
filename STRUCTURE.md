# 📁 Structure Complète du Projet

## Architecture du Projet

```
C:\Users\Waxy360\Desktop\site internet\
│
├── 📄 Frontend (HTML/CSS/JavaScript)
│   ├── index.html                    # Page principale (SSR)
│   ├── style.css                     # Styles CSS complets
│   └── script.js                     # JavaScript client
│
├── 🔌 Backend (Node.js/Express)
│   ├── server.js                     # Serveur Express principal
│   ├── backup.js                     # Gestionnaire de sauvegarde
│   └── package.json                  # Dépendances npm
│
├── 🔐 Configuration & Sécurité
│   ├── .env                          # Variables d'environnement (⚠️ Ne pas commiter)
│   ├── .env.example                  # Template de configuration
│   └── .gitignore                    # Fichiers à ignorer Git
│
├── 📚 Documentation
│   ├── README.md                     # Documentation complète
│   ├── QUICKSTART.md                 # Guide de démarrage rapide
│   ├── SECURITY.md                   # Guide de sécurité
│   └── STRUCTURE.md                  # Ce fichier
│
├── 💾 Données (Générées à la première exécution)
│   ├── data/
│   │   ├── users.json               # Base de données utilisateurs
│   │   ├── backup/
│   │   │   ├── backup-2024-01-15T10-30-45-123Z.json
│   │   │   ├── backup-safety-2024-01-15T15-45-00-456Z.json
│   │   │   └── ...
│   │   └── logs/
│   │       └── app.log
│   │
│   └── node_modules/                # Dépendances Node.js (npm install)
```

## Détail des Fichiers

### Frontend

#### `index.html` (585 lignes)
- Structure HTML sémantique
- Formulaires de login/inscription
- Modales réactives
- Système de notifications
- Profil utilisateur
- Design responsive

#### `style.css` (520 lignes)
- Variables CSS (couleurs, espacements)
- Design moderne et animé
- Media queries pour mobile
- Animations fluides
- Thème sombre gaming

#### `script.js` (280 lignes)
- Gestion des modales
- Validation des formulaires
- Intégration API
- Stockage localStorage
- Gestion des notifications

### Backend

#### `server.js` (450 lignes)
**Routes d'authentification:**
- `POST /api/auth/signup` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/verify` - Vérification token

**Routes utilisateur:**
- `GET /api/user/profile` - Récupérer le profil
- `PUT /api/user/profile` - Mettre à jour le profil
- `POST /api/user/change-password` - Changer le mot de passe
- `DELETE /api/user/account` - Supprimer le compte

**Système:**
- `GET /api/health` - Vérification du serveur

**Sécurité intégrée:**
- JWT authentication
- Bcrypt password hashing
- Rate limiting (5 tentatives max)
- Account locking (15 min)
- Validation des entrées
- CORS configurable

#### `backup.js` (280 lignes)
**Commandes:**
- `create` - Créer une sauvegarde manuelle
- `list` - Lister les sauvegardes
- `info` - Infos de la base de données
- `restore` - Restaurer une sauvegarde

**Fonctionnalités:**
- Checksum SHA-256
- Nettoyage automatique (10 derniers backups)
- Sauvegarde de sécurité avant restauration
- Timestamps ISO 8601

### Configuration

#### `.env`
Contient:
- `PORT` - Port du serveur (3000)
- `JWT_SECRET` - Clé secrète JWT
- `JWT_EXPIRATION` - Expiration des tokens (7j)
- `DB_PATH` - Chemin de la base de données
- `BACKUP_PATH` - Dossier des sauvegardes
- `BCRYPT_ROUNDS` - Rounds Bcrypt (10)
- `MAX_LOGIN_ATTEMPTS` - Tentatives max (5)
- `LOCK_TIME` - Durée du verrouillage (15 min)
- `CORS_ORIGIN` - Origines CORS autorisées

#### `.env.example`
Template prérempli pour copie facile

#### `.gitignore`
Protège:
- `.env` (variables sensibles)
- `data/` (base de données)
- `node_modules/` (dépendances)
- Fichiers temporaires et logs

### Documentation

#### `README.md` (400 lignes)
- Features complètes
- Installation étape par étape
- Structure du projet
- Endpoints API
- Commandes de sauvegarde
- Troubleshooting
- Variables d'environnement
- Notes de développement
- Déploiement production

#### `QUICKSTART.md` (250 lignes)
- Guide 5 minutes
- Étapes de configuration
- Vérifications rapides
- Commandes utiles
- Erreurs communes
- Prochaines étapes

#### `SECURITY.md` (350 lignes)
- Architecture de sécurité
- Flux d'authentification
- Chiffrement & hachage
- Protection des données
- Sauvegardes sécurisées
- Checklist production
- Incident response
- Bonnes pratiques

## Flux de Données

### Inscription

```
[Frontend HTML Form]
         ↓
    [JavaScript Validation]
         ↓
    [HTTPS POST Request]
         ↓
    [Backend Validation]
         ↓
    [Bcrypt Hash]
         ↓
    [Sauvegarde JSON]
         ↓
    [JWT Token Généré]
         ↓
    [localStorage Token]
```

### Connexion

```
[Login Form]
     ↓
[Validation Client]
     ↓
[HTTPS POST /api/auth/login]
     ↓
[Recherche Utilisateur]
     ↓
[Bcrypt Compare]
     ↓
[Rate Limiting Check]
     ↓
[JWT Token]
     ↓
[localStorage + Profil]
```

### Sauvegarde

```
[Utilisateur Créé/Modifié]
     ↓
[saveUsers(users)]
     ↓
[writeFileSync users.json]
     ↓
[backupDatabase() Auto 24h]
     ↓
[backup-TIMESTAMP.json]
     ↓
[Max 10 backups stockés]
```

## Sécurité par Couche

### Couche 1: Frontend
- ✅ Validation des formats
- ✅ Messages d'erreur clairs
- ✅ Masquage des mots de passe
- ✅ Gestion sécurisée des tokens

### Couche 2: Transport
- ✅ HTTPS obligatoire (production)
- ✅ CORS restrictif
- ✅ Headers de sécurité

### Couche 3: Authentification
- ✅ JWT avec expiration
- ✅ Secret fort 256 bits
- ✅ Tokens validés

### Couche 4: Validation
- ✅ Email RFC 5322
- ✅ Username alphanumerique
- ✅ Password force check
- ✅ Rate limiting

### Couche 5: Stockage
- ✅ Bcrypt 10 rounds
- ✅ Pas de plaintext
- ✅ Sauvegardes chiffrées
- ✅ Séparation données

## Utilisation des Ressources

### Dépendances NPM (6 principales)
```json
{
  "express": "Web framework",
  "bcrypt": "Password hashing",
  "jsonwebtoken": "JWT tokens",
  "dotenv": "Environment variables",
  "cors": "Cross-origin requests",
  "validator": "Input validation"
}
```

### Taille des Fichiers

| Fichier | Taille | Lignes |
|---------|--------|--------|
| server.js | ~15 KB | 450 |
| backup.js | ~9 KB | 280 |
| script.js | ~8 KB | 280 |
| style.css | ~14 KB | 520 |
| index.html | ~22 KB | 585 |
| **Total** | **~68 KB** | **~2115** |

## Performance

### Frontend
- Chargement CSS: <100ms
- Chargement JS: <50ms
- Rendu initial: <1s
- API Response: <100ms

### Backend
- Bcrypt hash: ~100ms/tentative
- JWT verify: <1ms
- Lecture DB: <5ms
- Sauvegarde: <50ms

## Maintenance

### Checklist Hebdomadaire
- [ ] Vérifier les logs d'erreurs
- [ ] Tester les backups/restaurations
- [ ] Vérifier les mises à jour npm
- [ ] Tester les formulaires

### Checklist Mensuelle
- [ ] Vérifier les métriques de sécurité
- [ ] Nettoyer les anciens backups
- [ ] Mettre à jour les dépendances
- [ ] Tester le déploiement

### Checklist Trimestrielle
- [ ] Audit de sécurité
- [ ] Vérifier OWASP Top 10
- [ ] Test de charge
- [ ] Revue des logs complets

## Intégrations Futures

### Base de Données
```javascript
// Migration future: JSON → MongoDB/PostgreSQL
// Minimal code change avec abstraction DB
```

### Email
```javascript
// Pour: Vérification email, Reset password
// Dépendance: nodemailer
```

### OAuth
```javascript
// Pour: Login Google/GitHub
// Dépendance: passport
```

### Analytics
```javascript
// Pour: Tracking utilisateurs, événements
// Dépendance: google-analytics-node
```

---

**Généré**: 2024-01-15  
**Version**: 1.0.0  
**Maintenue par**: Fløøxy's Community Team

