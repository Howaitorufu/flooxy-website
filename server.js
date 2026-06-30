const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Database helpers
const DB_PATH = process.env.DB_PATH || './data/users.json';
const BACKUP_PATH = process.env.BACKUP_PATH || './data/backup';

// Create data directory if not exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

if (!fs.existsSync(BACKUP_PATH)) {
    fs.mkdirSync(BACKUP_PATH, { recursive: true });
}

// Initialize users database
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], createdAt: new Date() }));
}

// Backup function
function backupDatabase() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(BACKUP_PATH, `backup-${timestamp}.json`);
        fs.writeFileSync(backupFile, data);
        console.log(`✓ Backup créé: ${backupFile}`);

        // Keep only last 10 backups
        const files = fs.readdirSync(BACKUP_PATH)
            .filter(f => f.startsWith('backup-'))
            .sort()
            .reverse();
        if (files.length > 10) {
            fs.unlinkSync(path.join(BACKUP_PATH, files[10]));
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
    }
}

// Daily backup
setInterval(backupDatabase, 24 * 60 * 60 * 1000);

// Get users from database
function getUsers() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data).users || [];
    } catch {
        return [];
    }
}

// Save users to database
function saveUsers(users) {
    try {
        const dbData = {
            users,
            updatedAt: new Date(),
            version: '1.0'
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        return false;
    }
}

// Verify JWT
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Middleware for protected routes
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: 'Token invalide' });
    }

    req.user = decoded;
    next();
}

// Validation helpers
function validateEmail(email) {
    return validator.isEmail(email);
}

function validateUsername(username) {
    return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(username);
}

function validatePassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Serveur Fløøxy\'s Community est en ligne' });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        if (!validateUsername(username)) {
            return res.status(400).json({
                message: 'Nom d\'utilisateur invalide (3-20 caractères, lettres, chiffres, - et _)',
                field: 'username'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Email invalide',
                field: 'email'
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: 'Mot de passe faible (min 8 caractères, 1 majuscule, 1 chiffre)',
                field: 'password'
            });
        }

        // Get users
        let users = getUsers();

        // Check if email exists
        if (users.find(u => u.email === email.toLowerCase())) {
            return res.status(409).json({
                message: 'Cet email est déjà utilisé',
                field: 'email'
            });
        }

        // Check if username exists
        if (users.find(u => u.username === username)) {
            return res.status(409).json({
                message: 'Ce nom d\'utilisateur est déjà pris',
                field: 'username'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

        // Create user
        const newUser = {
            id: Date.now().toString(),
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date(),
            lastLogin: null,
            verified: false,
            loginAttempts: 0,
            lockUntil: null
        };

        users.push(newUser);
        saveUsers(users);

        // Create token
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        backupDatabase();

        res.status(201).json({
            message: 'Inscription réussie',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Erreur signup:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        const users = getUsers();
        const user = users.find(u => u.email === email.toLowerCase());

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Check if account is locked
        if (user.lockUntil && new Date() < new Date(user.lockUntil)) {
            return res.status(429).json({
                message: 'Compte verrouillé. Veuillez réessayer plus tard'
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            if (user.loginAttempts >= parseInt(process.env.MAX_LOGIN_ATTEMPTS)) {
                user.lockUntil = new Date(Date.now() + parseInt(process.env.LOCK_TIME) * 60 * 1000);
            }

            saveUsers(users);
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = new Date();
        saveUsers(users);

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Verify token
app.post('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        message: 'Token valide',
        user: req.user
    });
});

// Get current user
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        verified: user.verified
    });
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (username && username !== users[userIndex].username) {
            if (!validateUsername(username)) {
                return res.status(400).json({ message: 'Nom d\'utilisateur invalide' });
            }

            if (users.some(u => u.username === username && u.id !== req.user.id)) {
                return res.status(409).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
            }

            users[userIndex].username = username;
        }

        saveUsers(users);
        backupDatabase();

        res.json({
            message: 'Profil mis à jour',
            user: {
                id: users[userIndex].id,
                username: users[userIndex].username,
                email: users[userIndex].email
            }
        });

    } catch (error) {
        console.error('Erreur update profile:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Change password
app.post('/api/user/change-password', authenticateToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                message: 'Le nouveau mot de passe doit contenir au minimum 8 caractères, 1 majuscule et 1 chiffre'
            });
        }

        const users = getUsers();
        const user = users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS));
        saveUsers(users);
        backupDatabase();

        res.json({ message: 'Mot de passe changé avec succès' });

    } catch (error) {
        console.error('Erreur change password:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Delete account
app.delete('/api/user/account', authenticateToken, (req, res) => {
    try {
        const users = getUsers();
        const filteredUsers = users.filter(u => u.id !== req.user.id);
        saveUsers(filteredUsers);
        backupDatabase();

        res.json({ message: 'Compte supprimé' });

    } catch (error) {
        console.error('Erreur delete account:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur interne' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Fløøxy's Community serveur lancé sur http://localhost:${PORT}`);
    console.log(`📁 Base de données: ${DB_PATH}`);
    console.log(`💾 Sauvegarde: ${BACKUP_PATH}`);
    console.log(`🔒 Sécurité: JWT + Bcrypt activée`);
});
