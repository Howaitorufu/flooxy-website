// Profile Page JavaScript
const API_URL = 'http://localhost:3000/api';

let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProfile();
    setupEventListeners();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = JSON.parse(user);
}

function setupEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('deleteAccountBtn').addEventListener('click', handleDeleteAccount);
}

async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            displayProfile(data);
        } else {
            showNotification('Erreur lors du chargement du profil', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de connexion', 'error');
    }
}

function displayProfile(user) {
    const firstLetter = user.username.charAt(0).toUpperCase();

    // Profile header
    document.getElementById('profileAvatar').textContent = firstLetter;
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;

    // Format date
    const createdDate = new Date(user.createdAt).toLocaleDateString('fr-FR');
    document.getElementById('memberDate').textContent = createdDate;

    // Role
    if (user.role === 'admin' || currentUser.isAdmin) {
        document.getElementById('profileRole').textContent = '🔱 ADMIN';
    } else if (user.role === 'moderator') {
        document.getElementById('profileRole').textContent = '👮 Modérateur';
    }

    // Form fields
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;

    // Stats (exemple)
    document.getElementById('postsCount').textContent = Math.floor(Math.random() * 50);
    document.getElementById('likesCount').textContent = Math.floor(Math.random() * 500);
    document.getElementById('gamesCount').textContent = Math.floor(Math.random() * 20);
    document.getElementById('hoursCount').textContent = Math.floor(Math.random() * 1000);
}

async function handleEditProfile(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;

    if (!email) {
        showNotification('L\'email est requis', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Profil mis à jour avec succès!', 'success');
            document.getElementById('successMessage').classList.add('show');
            setTimeout(() => {
                document.getElementById('successMessage').classList.remove('show');
            }, 3000);
        } else {
            showNotification(data.message || 'Erreur lors de la mise à jour', 'error');
        }
    } catch (error) {
        showNotification('Erreur serveur', 'error');
    }
}

async function handleChangePassword(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showNotification('Le mot de passe doit contenir au minimum 8 caractères', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/user/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Mot de passe changé avec succès!', 'success');
            document.getElementById('changePasswordForm').reset();
        } else {
            showNotification(data.message || 'Erreur lors du changement du mot de passe', 'error');
        }
    } catch (error) {
        showNotification('Erreur serveur', 'error');
    }
}

function handleDeleteAccount() {
    if (confirm('⚠️ ATTENTION: Cette action est irréversible!\n\nÊtes-vous sûr de vouloir supprimer votre compte?')) {
        if (confirm('Êtes-vous ABSOLUMENT sûr? Tous vos données seront perdues définitivement.')) {
            deleteAccount();
        }
    }
}

async function deleteAccount() {
    try {
        const response = await fetch(`${API_URL}/user/account`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showNotification('Compte supprimé. Redirection...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showNotification('Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showNotification('Erreur serveur', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
