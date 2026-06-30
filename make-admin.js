const fs = require('fs');
const path = require('path');

const DB_PATH = './data/users.json';

console.log('');
console.log('========================================');
console.log('Promotion d\'utilisateur en ADMIN');
console.log('========================================');
console.log('');

// Read database
if (!fs.existsSync(DB_PATH)) {
    console.log('❌ ERREUR: Base de données non trouvée!');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const users = data.users || [];

console.log(`Utilisateurs trouvés: ${users.length}`);
console.log('');

// Find Waxy360
const user = users.find(u => u.username.toLowerCase() === 'waxy360');

if (!user) {
    console.log('❌ ERREUR: Utilisateur "Waxy360" non trouvé!');
    console.log('');
    console.log('Utilisateurs existants:');
    users.forEach(u => console.log(`  - ${u.username} (${u.email})`));
    process.exit(1);
}

console.log(`✅ Utilisateur trouvé: ${user.username}`);
console.log(`   Email: ${user.email}`);
console.log('');

// Make admin
user.role = 'admin';
user.isAdmin = true;

// Save
fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

console.log('✅ SUCCÈS!');
console.log('');
console.log(`${user.username} est maintenant ADMIN!`);
console.log('');
console.log('Tu peux maintenant accéder à:');
console.log('  - http://localhost:3000/admin');
console.log('');
