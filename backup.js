const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './data/users.json';
const BACKUP_PATH = process.env.BACKUP_PATH || './data/backup';

class BackupManager {
    constructor() {
        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!fs.existsSync(path.dirname(DB_PATH))) {
            fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
        }
        if (!fs.existsSync(BACKUP_PATH)) {
            fs.mkdirSync(BACKUP_PATH, { recursive: true });
        }
    }

    createBackup(label = '') {
        try {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = label
                ? `backup-${label}-${timestamp}.json`
                : `backup-${timestamp}.json`;
            const backupFile = path.join(BACKUP_PATH, filename);

            fs.writeFileSync(backupFile, data);

            const stats = fs.statSync(backupFile);
            const checksum = this.calculateChecksum(data);

            console.log(`✓ Sauvegarde créée: ${filename}`);
            console.log(`  Taille: ${(stats.size / 1024).toFixed(2)} KB`);
            console.log(`  Checksum: ${checksum}`);

            this.cleanOldBackups();
            return backupFile;
        } catch (error) {
            console.error('✗ Erreur lors de la création de la sauvegarde:', error);
            return null;
        }
    }

    cleanOldBackups(maxBackups = 10) {
        try {
            const files = fs.readdirSync(BACKUP_PATH)
                .filter(f => f.startsWith('backup-'))
                .map(f => ({
                    name: f,
                    time: fs.statSync(path.join(BACKUP_PATH, f)).mtime
                }))
                .sort((a, b) => b.time - a.time);

            if (files.length > maxBackups) {
                const toDelete = files.slice(maxBackups);
                toDelete.forEach(file => {
                    fs.unlinkSync(path.join(BACKUP_PATH, file.name));
                    console.log(`🗑️  Ancien backup supprimé: ${file.name}`);
                });
            }
        } catch (error) {
            console.error('Erreur lors du nettoyage des backups:', error);
        }
    }

    calculateChecksum(data) {
        return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
    }

    listBackups() {
        try {
            const files = fs.readdirSync(BACKUP_PATH)
                .filter(f => f.startsWith('backup-'))
                .map(f => {
                    const stats = fs.statSync(path.join(BACKUP_PATH, f));
                    return {
                        name: f,
                        size: (stats.size / 1024).toFixed(2),
                        created: stats.mtime
                    };
                })
                .sort((a, b) => b.created - a.created);

            console.log('\n📊 Backups disponibles:');
            files.forEach((file, i) => {
                console.log(`${i + 1}. ${file.name} (${file.size} KB) - ${file.created.toLocaleString()}`);
            });
            return files;
        } catch (error) {
            console.error('Erreur lors de la lecture des backups:', error);
            return [];
        }
    }

    restoreBackup(filename) {
        try {
            const backupFile = path.join(BACKUP_PATH, filename);

            if (!fs.existsSync(backupFile)) {
                console.error('✗ Fichier de sauvegarde non trouvé:', filename);
                return false;
            }

            const backupData = fs.readFileSync(backupFile, 'utf8');

            // Create a safety backup before restoring
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const safetyBackup = path.join(BACKUP_PATH, `backup-safety-${timestamp}.json`);
            fs.copyFileSync(DB_PATH, safetyBackup);

            fs.writeFileSync(DB_PATH, backupData);
            console.log(`✓ Sauvegarde restaurée: ${filename}`);
            console.log(`✓ Sauvegarde de sécurité créée: backup-safety-${timestamp}.json`);
            return true;
        } catch (error) {
            console.error('✗ Erreur lors de la restauration:', error);
            return false;
        }
    }

    getDatabaseInfo() {
        try {
            const stats = fs.statSync(DB_PATH);
            const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

            console.log('\n📈 Informations de la base de données:');
            console.log(`Fichier: ${DB_PATH}`);
            console.log(`Taille: ${(stats.size / 1024).toFixed(2)} KB`);
            console.log(`Nombres d'utilisateurs: ${data.users ? data.users.length : 0}`);
            console.log(`Dernière mise à jour: ${data.updatedAt || 'N/A'}`);
            console.log(`Version: ${data.version || '1.0'}`);

            return {
                size: stats.size,
                users: data.users ? data.users.length : 0,
                lastUpdate: data.updatedAt
            };
        } catch (error) {
            console.error('Erreur lors de la lecture des infos:', error);
            return null;
        }
    }
}

// CLI
const args = process.argv.slice(2);
const manager = new BackupManager();

if (args.length === 0) {
    console.log('\n🛡️  Gestionnaire de Sauvegarde - Fløøxy\'s Community\n');
    console.log('Commandes disponibles:');
    console.log('  node backup.js create [label]  - Créer une sauvegarde');
    console.log('  node backup.js list             - Lister les sauvegardes');
    console.log('  node backup.js info             - Infos de la base de données');
    console.log('  node backup.js restore <file>   - Restaurer une sauvegarde');
    console.log('');
} else {
    const command = args[0];

    switch (command) {
        case 'create':
            const label = args[1] || '';
            manager.createBackup(label);
            break;
        case 'list':
            manager.listBackups();
            break;
        case 'info':
            manager.getDatabaseInfo();
            break;
        case 'restore':
            if (args[1]) {
                manager.restoreBackup(args[1]);
            } else {
                console.error('✗ Veuillez spécifier le fichier de sauvegarde');
            }
            break;
        default:
            console.error(`✗ Commande inconnue: ${command}`);
    }
}
