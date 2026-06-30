@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1

cls
echo.
echo FLOOXY'S COMMUNITY - SERVER LAUNCHER
echo ========================================
echo.

REM Check if in correct directory
if not exist "package.json" (
    echo ERREUR: package.json non trouve!
    echo.
    echo Assurez-vous d'etre dans le bon dossier:
    echo C:\Users\Waxy360\Desktop\site internet
    echo.
    echo Dossier actuel: %cd%
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERREUR lors de npm install
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo DEMARRAGE DU SERVEUR
echo ========================================
echo.
echo URL: http://localhost:3000
echo.
echo En attente du serveur...
echo.

REM Start npm and capture any errors
npm start

REM If we get here, npm failed
echo.
echo ========================================
echo ERREUR AU DEMARRAGE!
echo ========================================
echo.
echo Si tu vois une erreur ci-dessus, copie-la et dis-la moi!
echo.
echo Appuyez sur une touche pour fermer...
echo.
pause

exit /b 1
