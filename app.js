// API Configuration
const API_URL = 'http://localhost:3000/api';

// State
let currentUser = null;
let games = [];
let posts = [];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const newPostModal = document.getElementById('newPostModal');
const newPostBtn = document.getElementById('newPostBtn');
const userDropdown = document.getElementById('userDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const notification = document.getElementById('notification');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadStats();
    loadGames();
    loadPosts();
    checkAuthStatus();
});

function initializeApp() {
    setupEventListeners();
}

function setupEventListeners() {
    // Auth modals
    loginBtn.addEventListener('click', openLoginModal);
    signupBtn.addEventListener('click', openSignupModal);
    document.getElementById('switchToSignup').addEventListener('click', (e) => {
        e.preventDefault();
        closeLoginModal();
        openSignupModal();
    });
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeSignupModal();
        openLoginModal();
    });

    // Close modals
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('contactForm').addEventListener('submit', handleContact);
    document.getElementById('newPostForm').addEventListener('submit', handleNewPost);

    // New post button
    newPostBtn.addEventListener('click', () => newPostModal.classList.add('active'));

    // Search and filter
    document.getElementById('searchGames').addEventListener('input', filterGames);
    document.getElementById('filterGenre').addEventListener('change', filterGames);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Dashboard
    document.getElementById('dashboardBtn').addEventListener('click', () => {
        window.location.href = 'admin.html';
    });

    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Auth Functions
function openLoginModal() {
    loginModal.classList.add('active');
}

function closeLoginModal() {
    loginModal.classList.remove('active');
}

function openSignupModal() {
    signupModal.classList.add('active');
}

function closeSignupModal() {
    signupModal.classList.remove('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showNotification('Connexion réussie!', 'success');
            closeLoginModal();
            updateAuthUI();
            form.reset();
        } else {
            showNotification(data.message || 'Erreur de connexion', 'error');
        }
    } catch (error) {
        showNotification('Erreur serveur', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const username = form.querySelector('input[type="text"]').value;
    const email = form.querySelectorAll('input[type="email"]')[0].value;
    const password = form.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showNotification('Inscription réussie!', 'success');
            closeSignupModal();
            updateAuthUI();
            form.reset();
        } else {
            showNotification(data.message || 'Erreur d\'inscription', 'error');
        }
    } catch (error) {
        showNotification('Erreur serveur', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showNotification('Déconnecté avec succès', 'success');
    updateAuthUI();
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

function updateAuthUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userDropdown.style.display = 'flex';
        newPostBtn.style.display = 'block';

        // Check if admin
        const dashboardBtn = document.getElementById('dashboardBtn');
        if (currentUser.isAdmin || currentUser.role === 'admin') {
            dashboardBtn.style.display = 'flex';
        } else {
            dashboardBtn.style.display = 'none';
        }
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        userDropdown.style.display = 'none';
        newPostBtn.style.display = 'none';
    }
}

// Games Functions
async function loadGames() {
    try {
        const response = await fetch(`${API_URL}/games`, {
            headers: currentUser ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}
        });
        const data = await response.json();
        games = data.games || [];
        renderGames(games);
        updateStats();
    } catch (error) {
        console.error('Erreur lors du chargement des jeux:', error);
        renderDefaultGames();
    }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();
        document.getElementById('userCount').textContent = stats.totalUsers;
        document.getElementById('gameCount').textContent = stats.totalGames;
    } catch (error) {
        console.error('Erreur stats:', error);
    }
}

function renderDefaultGames() {
    const defaultGames = [
        {
            id: 1,
            title: 'Shadow Realm',
            genre: 'RPG',
            rating: 4.8,
            players: 125000,
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 2,
            title: 'Neon Rush',
            genre: 'FPS',
            rating: 4.6,
            players: 98000,
            image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 3,
            title: 'Mythos Legends',
            genre: 'RPG',
            rating: 4.9,
            players: 156000,
            image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 4,
            title: 'Galaxy Wars',
            genre: 'Strategy',
            rating: 4.5,
            players: 87000,
            image: 'https://images.unsplash.com/photo-1538481072177-d627dface115?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 5,
            title: 'Urban Chase',
            genre: 'Racing',
            rating: 4.7,
            players: 112000,
            image: 'https://images.unsplash.com/photo-1493711662714-4c4eb0f696b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 6,
            title: 'Adventure Quest',
            genre: 'Adventure',
            rating: 4.4,
            players: 95000,
            image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        }
    ];
    games = defaultGames;
    renderGames(games);
    updateStats();
}

function renderGames(gamesToRender) {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = gamesToRender.map(game => `
        <div class="game-card">
            <div class="game-image" style="background-image: url('${game.image}')"></div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.genre}</p>
                <div class="game-footer">
                    <span class="rating">⭐ ${game.rating}</span>
                    <span>${(game.players / 1000).toFixed(0)}K joueurs</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterGames() {
    const searchTerm = document.getElementById('searchGames').value.toLowerCase();
    const genre = document.getElementById('filterGenre').value;

    const filtered = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm);
        const matchesGenre = !genre || game.genre === genre;
        return matchesSearch && matchesGenre;
    });

    renderGames(filtered);
}

// Posts Functions
async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/forum/posts`);
        const data = await response.json();
        posts = data.posts || [];
        renderPosts();
    } catch (error) {
        console.error('Erreur lors du chargement des posts:', error);
        renderDefaultPosts();
    }
}

function renderDefaultPosts() {
    posts = [
        {
            id: 1,
            title: 'Bienvenue sur Fløøxy\'s Community!',
            author: 'Admin',
            category: 'General',
            content: 'Bienvenue! Partagez vos expériences gaming ici.',
            likes: 245,
            comments: 32
        },
        {
            id: 2,
            title: 'Nouveau jeu: Shadow Realm',
            author: 'Gamer',
            category: 'Games',
            content: 'Shadow Realm est incroyable! Avez-vous des astuces?',
            likes: 120,
            comments: 45
        },
        {
            id: 3,
            title: 'Tournoi Hebdomadaire',
            author: 'Event Manager',
            category: 'Events',
            content: 'Inscription ouverte pour le tournoi de cette semaine!',
            likes: 89,
            comments: 23
        }
    ];
    renderPosts();
}

function renderPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <div class="post-author">
                    <div class="post-avatar">${post.author[0].toUpperCase()}</div>
                    <div class="post-meta">
                        <h3>${post.title}</h3>
                        <p>par ${post.author} • ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <span class="post-category">${post.category}</span>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-actions">
                <button class="post-action">
                    <i class="fas fa-thumbs-up"></i> ${post.likes}
                </button>
                <button class="post-action">
                    <i class="fas fa-comments"></i> ${post.comments}
                </button>
                <button class="post-action">
                    <i class="fas fa-share"></i> Partager
                </button>
            </div>
        </div>
    `).join('');
}

async function handleNewPost(e) {
    e.preventDefault();
    if (!currentUser) {
        showNotification('Connectez-vous d\'abord', 'error');
        openLoginModal();
        return;
    }

    const form = e.target;
    const title = form.querySelector('input[type="text"]').value;
    const content = form.querySelector('textarea').value;
    const category = form.querySelector('select').value;

    const newPost = {
        id: posts.length + 1,
        title,
        author: currentUser.username,
        category,
        content,
        likes: 0,
        comments: 0
    };

    posts.unshift(newPost);
    renderPosts();
    showNotification('Post publié!', 'success');
    newPostModal.classList.remove('active');
    form.reset();
}

// Contact Functions
async function handleContact(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        if (response.ok) {
            showNotification('Message envoyé! Nous vous répondrons bientôt.', 'success');
            form.reset();
        } else {
            showNotification('Erreur lors de l\'envoi du message', 'error');
        }
    } catch (error) {
        showNotification('Erreur serveur', 'error');
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateStats() {
    const userCount = localStorage.getItem('userCount') || '50000+';
    const gameCount = games.length;
    document.getElementById('userCount').textContent = userCount;
    document.getElementById('gameCount').textContent = gameCount;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.remove('active');
    if (e.target === signupModal) signupModal.classList.remove('active');
    if (e.target === newPostModal) newPostModal.classList.remove('active');
});
