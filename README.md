# 🎮 Fløøxy's Community

Plateforme gaming moderne avec système d'authentification sécurisé, sauvegarde automatique et gestion des utilisateurs.

## 🚀 Features

- ✅ **Authentification Sécurisée** - Mot de passe haché avec Bcrypt
- ✅ **Système d'Enregistrement** - Validation complète des données
- ✅ **JWT Tokens** - Sessions sécurisées avec expiration
- ✅ **Sauvegarde Automatique** - Backups quotidiens
- ✅ **Protection Contre les Attaques** - Limitation des tentatives de connexion
- ✅ **CORS Sécurisé** - Contrôle des origines
- ✅ **Design Responsif** - Mobile-friendly
- ✅ **Gestion des Profils** - Modification sécurisée des données

## 📋 Prerequisites

- Node.js 14+ 
- npm ou yarn
- Windows PowerShell / Git Bash

## 🔧 Installation

1. **Installer les dépendances:**
```bash
cd "C:\Users\Waxy360\Desktop\site internet"
npm install
```

2. **Configurer les variables d'environnement:**
   - Éditez le fichier `.env`
   - ⚠️ **IMPORTANT**: Changez `JWT_SECRET` en production!
   ```bash
   JWT_SECRET=your_super_secret_key_here
   ```

3. **Créer les dossiers de données:**
```bash
mkdir data
mkdir data\backup
```

## ▶️ Démarrage

### Mode Production:
```bash
npm start
```

### Mode Développement (avec rechargement automatique):
```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:3000`

## 📁 Structure du Projet

```
C:\Users\Waxy360\Desktop\site internet\
├── index.html              # Page principale
├── style.css              # Styles CSS
├── script.js              # JavaScript frontend
├── server.js              # Serveur Express backend
├── backup.js              # Gestionnaire de sauvegarde
├── package.json           # Dépendances
├── .env                   # Variables d'environnement
├── .env.example           # Template .env
├── README.md              # Cette documentation
├── data/
│   ├── users.json         # Base de données utilisateurs
│   └── backup/            # Dossier des sauvegardes
│       ├── backup-2024-01-15T10-30-45-123Z.json
│       └── ...
└── node_modules/          # Dépendances installées
```

## 🔐 Sécurité

### Mots de Passe
- Minimum 8 caractères
- Au moins 1 majuscule (A-Z)
- Au moins 1 chiffre (0-9)
- Hachage: Bcrypt avec 10 rounds

### Authentification
- JWT (JSON Web Tokens)
- Expiration: 7 jours (configurable)
- Stockage: LocalStorage navigateur

### Protection
- **Rate Limiting**: Max 5 tentatives de connexion
- **Account Locking**: 15 minutes après 5 échecs
- **CORS**: Origines blanelist configurées
- **Validation**: Emails, usernames, données entrantes
- **Sauvegarde**: Automatique chaque 24h + manuelle

## 📡 API Endpoints

### Authentification
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/verify
```

### Profil Utilisateur
```
GET  /api/user/profile
PUT  /api/user/profile
POST /api/user/change-password
DELETE /api/user/account
```

### Système
```
GET /api/health
```

## 💾 Sauvegarde & Restauration

### Créer une sauvegarde manuelle:
```bash
node backup.js create
node backup.js create "avant-update"
```

### Lister les sauvegardes:
```bash
node backup.js list
```

### Restaurer une sauvegarde:
```bash
node backup.js restore backup-2024-01-15T10-30-45-123Z.json
```

### Infos de la base de données:
```bash
node backup.js info
```

## 📊 Base de Données

Les utilisateurs sont stockés dans `data/users.json`:

```json
{
  "users": [
    {
      "id": "1704067200000",
      "username": "john_doe",
      "email": "john@example.com",
      "password": "$2b$10$...", // Bcrypt hash
      "createdAt": "2024-01-01T10:00:00.000Z",
      "lastLogin": "2024-01-15T14:30:00.000Z",
      "verified": false,
      "loginAttempts": 0,
      "lockUntil": null
    }
  ],
  "updatedAt": "2024-01-15T15:45:00.000Z",
  "version": "1.0"
}
```

## 🌐 Frontend

### Pages incluses:
- **Accueil** (index.html)
- **Modales de Connexion/Inscription**
- **Profil Utilisateur**
- **Système de Notifications**

### Fonctionnalités:
- Validation côté client
- Gestion des tokens JWT
- Persistance de session (LocalStorage)
- Notifications en temps réel
- Design responsive

## 🐛 Troubleshooting

### Erreur: "Module not found"
```bash
npm install
```

### Erreur: "Port 3000 already in use"
```bash
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force

# Ou changer le port dans .env
PORT=3001
```

### Erreur: "CORS policy"
Vérifiez que votre URL frontend est dans `CORS_ORIGIN` dans `.env`

### Données perdues
```bash
node backup.js list
node backup.js restore <nom-du-backup>
```

## 🔄 Variables d'Environnement

```env
# Serveur
PORT=3000
NODE_ENV=development

# Sécurité JWT
JWT_SECRET=change_me_in_production
JWT_EXPIRATION=7d

# Base de données
DB_PATH=./data/users.json
BACKUP_PATH=./data/backup

# Protection
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=15

# CORS (origines autorisées)
CORS_ORIGIN=http://localhost:3000,http://localhost:5000
```

## 📝 Notes de Développement

### Password Requirements
- Longueur: 8+ caractères
- Complexité: 1 Majuscule + 1 Chiffre
- Hachage: Bcrypt (10 rounds)

### Username Requirements  
- Longueur: 3-20 caractères
- Caractères: A-Z, a-z, 0-9, -, _

### Email Validation
- Format RFC 5322 (standard email)
- Unicité vérifiée (pas de doublon)

### Rate Limiting
- Max 5 tentatives login
- Lock time: 15 minutes
- Reset après succès

## 🚀 Production Deployment

Avant de déployer en production:

1. **Changez JWT_SECRET**:
```bash
# Générer une clé sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **Activez HTTPS/SSL**
3. **Configurez la base de données** (MySQL/PostgreSQL recommandé)
4. **Mettez en place un monitoring**
5. **Configurez les backups externalisés** (Cloud Storage)

## 📧 Support & Contact

- 📧 contact@flooxycommunity.fr
- 🌐 https://flooxycommunity.fr
- 💬 Discord: [Lien du serveur]

## 📄 Licence

MIT License - Fløøxy's Community © 2024

## ⚠️ Important

- 🔐 Ne commitez JAMAIS `.env` sur Git
- 💾 Faites des sauvegardes régulièrement
- 🔑 Changez JWT_SECRET en production
- 📊 Nettoyez les anciens backups
- 🛡️ Maintenez les dépendances à jour

---

**Bienvenue dans Fløøxy's Community! 🎮✨**
