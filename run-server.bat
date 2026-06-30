@echo off
chcp 65001 > nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      🚀 FLØØXY'S COMMUNITY - SERVER LAUNCHER 🚀           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📍 Dossier: %cd%
echo.
echo Vérification des fichiers...
if not exist "package.json" (
    echo ❌ ERREUR: package.json non trouvé!
    echo Assurez-vous d'être dans le dossier correct
    pause
    exit /b 1
)
echo ✅ package.json trouvé

if not exist "node_modules" (
    echo.
    echo 📦 Installation des dépendances (première fois)...
    call npm install
    if errorlevel 1 (
        echo ❌ Erreur lors de npm install
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          🎮 Démarrage du serveur...                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📡 Serveur en cours de démarrage...
echo 💻 URL: http://localhost:3000
echo 🛑 Pour arrêter: Appuyez sur Ctrl+C
echo.
echo ════════════════════════════════════════════════════════════
echo.

call npm start

if errorlevel 1 (
    echo.
    echo ════════════════════════════════════════════════════════════
    echo ❌ ERREUR DÉTECTÉE!
    echo.
    echo Lisez les messages ci-dessus pour plus de détails.
    echo Appuyez sur une touche pour fermer...
    pause > nul
    exit /b 1
)

pause
