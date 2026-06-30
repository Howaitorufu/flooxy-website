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

    // Customization fields
    document.getElementById('bio').value = user.bio || '';
    document.getElementById('country').value = user.country || '';
    document.getElementById('favoriteGame').value = user.favoriteGame || '';
    document.getElementById('discord').value = user.discord || '';
    document.getElementById('twitch').value = user.twitch || '';
    document.getElementById('achievements').value = user.achievements || '';
    document.getElementById('profilePublic').checked = user.profilePublic !== false;
    document.getElementById('emailNotifs').checked = user.emailNotifs !== false;
    document.getElementById('darkMode').checked = user.darkMode !== false;

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

    const profileData = {
        email,
        bio: document.getElementById('bio').value,
        country: document.getElementById('country').value,
        favoriteGame: document.getElementById('favoriteGame').value,
        discord: document.getElementById('discord').value,
        twitch: document.getElementById('twitch').value,
        achievements: document.getElementById('achievements').value,
        profilePublic: document.getElementById('profilePublic').checked,
        emailNotifs: document.getElementById('emailNotifs').checked,
        darkMode: document.getElementById('darkMode').checked
    };

    console.log('Envoi des données:', profileData);

    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(profileData)
        });

        console.log('Réponse serveur:', response.status, response.statusText);

        const data = await response.json();
        console.log('Données reçues:', data);

        if (response.ok) {
            showNotification('✅ Profil sauvegardé avec succès!', 'success');
            console.log('Profil sauvegardé!');

            document.getElementById('successMessage').classList.add('show');
            setTimeout(() => {
                document.getElementById('successMessage').classList.remove('show');
            }, 3000);

            // Update local user data
            if (data.user) {
                Object.assign(currentUser, data.user);
                localStorage.setItem('user', JSON.stringify(currentUser));
                console.log('Données locales mises à jour:', currentUser);

                // Recharge la page après 1 seconde pour afficher les changements
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        } else {
            console.error('Erreur serveur:', data);
            showNotification('❌ ' + (data.message || 'Erreur lors de la mise à jour'), 'error');
        }
    } catch (error) {
        console.error('Erreur fetch:', error);
        showNotification('❌ Erreur de connexion au serveur', 'error');
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
