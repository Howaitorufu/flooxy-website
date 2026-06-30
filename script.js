// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeButtons = document.querySelectorAll('.close-modal');
const userProfile = document.getElementById('userProfile');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const logoutBtn = document.getElementById('logoutBtn');

const API_URL = 'http://localhost:3000/api';

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
    signupModal.style.display = 'none';
});

signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'flex';
    loginModal.style.display = 'none';
});

// Switch between modals
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'flex';
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
    }
});

// Password validation
function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return minLength && hasUpperCase && hasNumber;
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('Connexion réussie!', 'success');
            loginModal.style.display = 'none';
            updateUserProfile(data.user);
            document.getElementById('loginForm').reset();
        } else {
            showNotification(data.message || 'Erreur de connexion', 'error');
        }
    } catch (error) {
        showNotification('Erreur de connexion au serveur', 'error');
    }
});

// Signup form submission
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Clear previous errors
    document.getElementById('usernameError').style.display = 'none';
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('confirmError').style.display = 'none';

    // Validation
    let hasError = false;

    if (username.length < 3) {
        document.getElementById('usernameError').textContent = 'Min. 3 caractères';
        document.getElementById('usernameError').style.display = 'block';
        hasError = true;
    }

    if (!validatePassword(password)) {
        document.getElementById('passwordError').textContent = 'Min. 8 caractères, 1 majuscule, 1 chiffre';
        document.getElementById('passwordError').style.display = 'block';
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('confirmError').textContent = 'Les mots de passe ne correspondent pas';
        document.getElementById('confirmError').style.display = 'block';
        hasError = true;
    }

    if (!agreeTerms) {
        showNotification('Vous devez accepter les conditions d\'utilisation', 'error');
        hasError = true;
    }

    if (hasError) return;

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('Inscription réussie! Bienvenue dans Fløøxy\'s Community', 'success');
            signupModal.style.display = 'none';
            updateUserProfile(data.user);
            document.getElementById('signupForm').reset();
        } else {
            if (data.field === 'email') {
                document.getElementById('emailError').textContent = data.message;
                document.getElementById('emailError').style.display = 'block';
            } else {
                showNotification(data.message || 'Erreur d\'inscription', 'error');
            }
        }
    } catch (error) {
        showNotification('Erreur de connexion au serveur', 'error');
    }
});

// Newsletter form
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    showNotification('Merci de votre inscription à la newsletter!', 'success');
    this.reset();
});

// Show notification
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = 'notification show ' + type;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Update user profile
function updateUserProfile(user) {
    document.getElementById('profileName').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    userProfile.classList.add('active');
}

// Toggle user profile
document.addEventListener('click', (e) => {
    if (e.target.closest('.auth-buttons button:not(#loginBtn):not(#signupBtn)')) {
        userProfile.classList.add('active');
    } else if (!userProfile.contains(e.target) && !e.target.closest('#loginBtn, #signupBtn, .auth-buttons')) {
        if (!e.target.closest('.modal')) {
            userProfile.classList.remove('active');
        }
    }
});

// Show profile when logged in
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        const userData = JSON.parse(user);
        updateUserProfile(userData);
    }
}

// Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    userProfile.classList.remove('active');
    showNotification('Vous avez été déconnecté', 'success');
});

// Initialize
checkAuthStatus();
