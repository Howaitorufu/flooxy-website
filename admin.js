// Admin Dashboard JavaScript
const API_URL = 'http://localhost:3000/api';

// State
let adminUser = null;
let adminUsers = [];
let adminGames = [];
let adminPosts = [];

// DOM Elements
const navItems = document.querySelectorAll('.nav-item:not(.logout)');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');
const logoutBtn = document.getElementById('logoutAdmin');
const notification = document.getElementById('notification');
const addUserModal = document.getElementById('addUserModal');
const addUserBtn = document.getElementById('addUserBtn');
const addGameBtn = document.getElementById('addGameBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    setupEventListeners();
    loadDashboardData();
});

function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    adminUser = JSON.parse(user);
    // In real app, verify admin role
    document.getElementById('adminName').textContent = adminUser.username;
}

function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            switchSection(sectionId);
        });
    });

    // Logout
    logoutBtn.addEventListener('click', handleAdminLogout);

    // Modals
    addUserBtn.addEventListener('click', () => addUserModal.classList.add('active'));
    document.getElementById('addGameBtn').addEventListener('click', openAddGameModal);
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Forms
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
    document.getElementById('generalSettings').addEventListener('submit', handleGeneralSettings);
    document.getElementById('securitySettings').addEventListener('submit', handleSecuritySettings);
    document.getElementById('backupBtn').addEventListener('click', handleBackup);
    document.getElementById('restoreBtn').addEventListener('click', handleRestore);
    document.getElementById('clearCacheBtn').addEventListener('click', handleClearCache);
    document.getElementById('logsBtn').addEventListener('click', handleViewLogs);
    document.getElementById('healthBtn').addEventListener('click', handleHealthCheck);

    // Refresh button
    document.querySelector('.btn-refresh').addEventListener('click', loadDashboardData);
}

function switchSection(sectionId) {
    // Update nav
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Update title
    const titles = {
        dashboard: 'Dashboard',
        users: 'Gestion des Utilisateurs',
        games: 'Gestion des Jeux',
        posts: 'Gestion des Posts',
        moderation: 'Modération & Signalements',
        analytics: 'Analytics & Statistiques',
        settings: 'Paramètres du Site'
    };
    pageTitle.textContent = titles[sectionId];

    // Load data if needed
    if (sectionId === 'users') loadUsers();
    if (sectionId === 'games') loadGames();
    if (sectionId === 'posts') loadPosts();
}

// Dashboard
function loadDashboardData() {
    updateStats();
    loadActivity();
}

function updateStats() {
    document.getElementById('totalUsers').textContent = '1,234';
    document.getElementById('totalGames').textContent = '12';
    document.getElementById('totalPosts').textContent = '456';
    document.getElementById('usersOnline').textContent = '245';
    document.getElementById('usersWeek').textContent = '1,234';
    document.getElementById('usersMonth').textContent = '5,678';
}

function loadActivity() {
    const activityList = document.getElementById('activityList');
    const activities = [
        { icon: 'fa-user-plus', text: 'Nouvel utilisateur inscrit', time: 'il y a 2 heures' },
        { icon: 'fa-comment', text: 'Nouveau post publié', time: 'il y a 1 heure' },
        { icon: 'fa-flag', text: 'Post signalé pour modération', time: 'il y a 30 minutes' },
        { icon: 'fa-gamepad', text: 'Nouveau jeu ajouté', time: 'il y a 15 minutes' }
    ];

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="fas ${activity.icon}"></i>
            <div>
                <p>${activity.text}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

// Users Management
function loadUsers() {
    const usersTableBody = document.getElementById('usersTableBody');
    const users = [
        { id: 1, username: 'john_doe', email: 'john@example.com', date: '2026-01-15', status: 'active' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', date: '2026-01-14', status: 'active' },
        { id: 3, username: 'bob_jones', email: 'bob@example.com', date: '2026-01-13', status: 'inactive' }
    ];

    usersTableBody.innerHTML = users.map(user => `
        <tr>
            <td>#${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.date}</td>
            <td><span class="status ${user.status}">${user.status === 'active' ? 'Actif' : 'Inactif'}</span></td>
            <td>
                <button class="btn btn-small btn-secondary">Éditer</button>
                <button class="btn btn-small btn-danger">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

function handleAddUser(e) {
    e.preventDefault();
    const form = e.target;
    const username = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const role = form.querySelector('select').value;

    showNotification('Utilisateur ajouté avec succès!', 'success');
    addUserModal.classList.remove('active');
    form.reset();
    loadUsers();
}

// Games Management
function loadGames() {
    const gamesGrid = document.getElementById('gamesAdminGrid');
    const games = [
        { id: 1, title: 'Shadow Realm', genre: 'RPG', players: 4532 },
        { id: 2, title: 'Neon Rush', genre: 'FPS', players: 3456 },
        { id: 3, title: 'Galaxy Wars', genre: 'Strategy', players: 2789 }
    ];

    gamesGrid.innerHTML = games.map(game => `
        <div class="game-admin-card">
            <div class="game-admin-image" style="background: linear-gradient(135deg, #ff6b35, #2a9d8f);">
                <i class="fas fa-gamepad" style="font-size: 3rem; color: white; display: flex; align-items: center; justify-content: center; height: 100%;"></i>
            </div>
            <div class="game-admin-info">
                <h4>${game.title}</h4>
                <p>${game.genre} • ${game.players} joueurs</p>
                <div class="game-admin-actions">
                    <button class="btn btn-small btn-secondary">Éditer</button>
                    <button class="btn btn-small btn-danger">Supprimer</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openAddGameModal() {
    // In real app, open a modal to add game
    showNotification('Ouverture du formulaire d\'ajout de jeu...', 'info');
}

// Posts Management
function loadPosts() {
    const postsTableBody = document.getElementById('postsTableBody');
    const posts = [
        { title: 'Bienvenue!', author: 'Admin', category: 'General', date: '2026-01-15', likes: 245 },
        { title: 'Shadow Realm - Guide complet', author: 'Gamer', category: 'Games', date: '2026-01-14', likes: 120 },
        { title: 'Tournoi Hebdomadaire', author: 'EventMgr', category: 'Events', date: '2026-01-13', likes: 89 }
    ];

    postsTableBody.innerHTML = posts.map(post => `
        <tr>
            <td>${post.title}</td>
            <td>${post.author}</td>
            <td>${post.category}</td>
            <td>${post.date}</td>
            <td>${post.likes}</td>
            <td>
                <button class="btn btn-small btn-secondary">Éditer</button>
                <button class="btn btn-small btn-danger">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

// Settings
function handleGeneralSettings(e) {
    e.preventDefault();
    showNotification('Paramètres généraux enregistrés!', 'success');
}

function handleSecuritySettings(e) {
    e.preventDefault();
    showNotification('Paramètres de sécurité enregistrés!', 'success');
}

function handleBackup() {
    showNotification('Sauvegarde en cours...', 'info');
    setTimeout(() => {
        showNotification('Sauvegarde complétée avec succès!', 'success');
    }, 2000);
}

function handleRestore() {
    if (confirm('Êtes-vous sûr de vouloir restaurer une sauvegarde? Cela remplacera les données actuelles.')) {
        showNotification('Restauration en cours...', 'info');
        setTimeout(() => {
            showNotification('Données restaurées avec succès!', 'success');
        }, 2000);
    }
}

function handleClearCache() {
    if (confirm('Êtes-vous sûr? Cela supprimera tout le cache.')) {
        showNotification('Cache en cours de suppression...', 'info');
        setTimeout(() => {
            showNotification('Cache supprimé avec succès!', 'success');
        }, 1000);
    }
}

function handleViewLogs() {
    showNotification('Logs système:\n- Server started at port 3000\n- 1234 users online\n- 12 jeux actifs', 'info');
}

function handleHealthCheck() {
    showNotification('✅ Serveur: OK\n✅ Base de données: OK\n✅ API: OK\n✅ Tous les services sont opérationnels!', 'success');
}

// Auth
function handleAdminLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Utility
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === addUserModal) addUserModal.classList.remove('active');
});
