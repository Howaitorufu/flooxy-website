# 🔒 Guide de Sécurité - Fløøxy's Community

## Table des Matières
1. [Architecture Sécurité](#architecture-sécurité)
2. [Authentification](#authentification)
3. [Chiffrement & Hachage](#chiffrement--hachage)
4. [Protection des Données](#protection-des-données)
5. [Sauvegardes](#sauvegardes)
6. [Checklist Production](#checklist-production)
7. [Incident Response](#incident-response)

---

## Architecture Sécurité

### Couches de Protection

```
┌─────────────────────────────────────┐
│    Frontend (HTTPS Required)         │
├─────────────────────────────────────┤
│    CORS + Validation Client          │
├─────────────────────────────────────┤
│    Backend API (Express)             │
├─────────────────────────────────────┤
│    JWT + Rate Limiting               │
├─────────────────────────────────────┤
│    Validation Server-side            │
├─────────────────────────────────────┤
│    Base de Données (Bcrypt)          │
├─────────────────────────────────────┤
│    Sauvegardes Chiffrées             │
└─────────────────────────────────────┘
```

---

## Authentification

### Flux d'Enregistrement

```
1. Formulaire Frontend
   ↓
2. Validation Client (format email, force mot de passe)
   ↓
3. Envoi HTTPS
   ↓
4. Validation Server (redondante)
   ↓
5. Vérification unicité (email, username)
   ↓
6. Hachage Bcrypt (10 rounds)
   ↓
7. Sauvegarde sécurisée
   ↓
8. JWT Token généré
```

### Flux de Connexion

```
1. Email + Mot de passe
   ↓
2. Validation format
   ↓
3. Recherche utilisateur
   ↓
4. Comparaison Bcrypt
   ↓
5. Vérification tentatives login
   ↓
6. Token JWT créé
   ↓
7. Timestamp "lastLogin" enregistré
```

### JWT Configuration

- **Algorithm**: HS256 (HMAC)
- **Expiration**: 7 jours (configurable)
- **Secret**: 256 bits minimum
- **Claims**:
  - `id`: User ID
  - `username`: Username
  - `email`: Email utilisateur
  - `iat`: Issued At
  - `exp`: Expiration

---

## Chiffrement & Hachage

### Mots de Passe

**Algorithme**: Bcrypt
- **Rounds**: 10 (configurable en `.env`)
- **Salt**: Auto-généré
- **Coût computationnel**: ~100ms par tentative

```javascript
// Hachage
password = "MySecure123"
hashed = await bcrypt.hash(password, 10)
// $2b$10$...

// Vérification
match = await bcrypt.compare(password, hashed)
```

**Caractéristiques requises**:
- ✅ Minimum 8 caractères
- ✅ Au moins 1 majuscule (A-Z)
- ✅ Au moins 1 chiffre (0-9)
- ✅ Pas d'exigence de caractères spéciaux (évite la complexité excessive)

### Données Sensibles

**Non chiffrées** (HTTPS suffit):
- Usernames
- Emails
- Metadata

**Hachées**:
- Mots de passe (Bcrypt)

**À chiffrer en production**:
- Numéros de téléphone
- Adresses
- Données de paiement

---

## Protection des Données

### CORS

```env
CORS_ORIGIN=http://localhost:3000,https://flooxycommunity.fr,https://app.flooxycommunity.fr
```

⚠️ **Attention**: Ne pas utiliser `*` en production!

### Validation des Entrées

**Email**:
```javascript
validator.isEmail(email)  // RFC 5322
```

**Username**:
```regex
^[a-zA-Z0-9_-]{3,20}$
```

**Mot de passe**:
```regex
^(?=.*[A-Z])(?=.*[0-9]).{8,}$
```

### Headers de Sécurité

À ajouter en production:

```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

---

## Sauvegardes

### Stratégie de Sauvegarde

```
┌─────────────────────────────────────┐
│   Sauvegarde Quotidienne Auto       │
│   ↓ (Tous les jours)                │
├─────────────────────────────────────┤
│   Stockage Local: Derniers 10       │
│   Checksum SHA-256                  │
├─────────────────────────────────────┤
│   Production: Cloud Storage         │
│   (S3, Azure, GCP)                  │
└─────────────────────────────────────┘
```

### Restoration de Sauvegarde

```bash
# Avant restauration
node backup.js create safety

# Restaurer
node backup.js restore backup-2024-01-15T10-30-45-123Z.json

# Vérifier les données
node backup.js info
```

### Intégrité des Données

```javascript
// Checksum SHA-256
crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex')
```

---

## Checklist Production

### ✅ Avant le déploiement

- [ ] **JWT_SECRET** changé (clé forte 256 bits)
- [ ] **NODE_ENV** = `production`
- [ ] **HTTPS/SSL** configuré
- [ ] **CORS** limité aux domaines approuvés
- [ ] **.env** NOT commitée sur Git (`.gitignore` configuré)
- [ ] **Base de données** sauvegardée en cloud
- [ ] **Logs** configurés et monitorés
- [ ] **Firewall** configuré
- [ ] **Rate limiting** activé
- [ ] **Monitoring** mis en place

### Variables Critiques

```env
# ❌ INCORRECT (insecure)
JWT_SECRET=mykey
NODE_ENV=development
CORS_ORIGIN=*

# ✅ CORRECT (secure)
JWT_SECRET=a5c4e9d1f7b2a8c0e3f5d9b1a7c4e0f2a5c8d1e4f7a0c3e6f9b2d5e8a1c4
NODE_ENV=production
CORS_ORIGIN=https://flooxycommunity.fr,https://app.flooxycommunity.fr
```

### Git Security

```bash
# .gitignore
.env
.env.local
data/users.json
data/backup/
node_modules/
*.log
```

```bash
# Pour retrouver les .env accidentellement commitées
git log -S ".env" --source --all
```

---

## Incident Response

### Scénario 1: Compromission de JWT_SECRET

**Étapes**:
1. Générer un nouveau JWT_SECRET
2. Mettre à jour `.env`
3. Tous les tokens existants deviennent invalides → Utilisateurs doivent se reconnecter
4. Redémarrer le serveur

```bash
# Générer une nouvelle clé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Scénario 2: Base de Données Compromise

**Étapes**:
1. Arrêter immédiatement le serveur
2. Créer une sauvegarde de sécurité
3. Restaurer le dernier backup sain
4. Vérifier les logs d'accès
5. Forcer la réinitialisation des mots de passe
6. Notifier les utilisateurs

```bash
node backup.js create compromise-incident
node backup.js restore backup-before-issue.json
```

### Scénario 3: Rate Limiting Bypass

**Protection**:
- Account locking après 5 tentatives
- Délai de 15 minutes
- Logs de toutes les tentatives échouées

```javascript
if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
  user.lockUntil = new Date(Date.now() + LOCK_TIME * 60 * 1000);
}
```

### Scénario 4: Fuite de Données

**Actions immédiates**:
1. Identifier l'étendue de la fuite
2. Notifier les utilisateurs affectés
3. Forcer la réinitialisation des mots de passe
4. Audit des logs d'accès
5. Améliorer la sécurité

---

## Bonnes Pratiques

### ✅ À Faire

- ✅ Utiliser HTTPS obligatoire
- ✅ Valider TOUTES les entrées serveur-side
- ✅ Stocker les mots de passe hashés
- ✅ Utiliser JWT avec expiration
- ✅ Logger les événements de sécurité
- ✅ Faire des sauvegardes régulières
- ✅ Mettre à jour les dépendances
- ✅ Tester les vulnérabilités
- ✅ Utiliser environment variables
- ✅ Limiter les tentatives de login

### ❌ À Éviter

- ❌ Ne pas stocker les mots de passe en clair
- ❌ Ne pas commitez `.env` sur Git
- ❌ Ne pas utiliser JWT secrets faibles
- ❌ Ne pas faire confiance aux données client
- ❌ Ne pas exposer les erreurs serveur détaillées
- ❌ Ne pas utiliser CORS = `*`
- ❌ Ne pas ignorer les mises à jour de sécurité
- ❌ Ne pas négliger les logs d'accès
- ❌ Ne pas tester en production
- ❌ Ne pas oublier les backups

---

## Ressources Utiles

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Bcrypt Info](https://en.wikipedia.org/wiki/Bcrypt)
- [HTTPS/SSL](https://letsencrypt.org/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

---

**Dernière mise à jour**: 2024-01-15  
**Mainteneur**: Fløøxy's Community Team  
**Version**: 1.0

