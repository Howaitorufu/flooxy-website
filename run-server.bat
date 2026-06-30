@echo off
cls
echo.
echo ========================================
echo FLOOXY'S COMMUNITY - SERVER LAUNCHER
echo ========================================
echo.
echo Verification des fichiers...

if not exist "package.json" (
    echo ERREUR: package.json non trouve!
    pause
    exit /b 1
)
echo OK: package.json trouve

if not exist "node_modules" (
    echo.
    echo Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo ERREUR lors de npm install
        pause
        exit /b 1
    )
    echo OK: Dependances installees
)

echo.
echo ========================================
echo DEMARRAGE DU SERVEUR
echo ========================================
echo.
echo URL: http://localhost:3000
echo Pour arreter: Appuyez sur Ctrl+C
echo.

call npm start

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERREUR DETECTEE - Voir les messages ci-dessus
    echo ========================================
    pause
    exit /b 1
)

pause
