@echo off
cls
echo.
echo Fermeture du serveur sur le port 3000...
echo.

netstat -ano | findstr :3000

echo.
echo En cours de fermeture...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /pid %%a /f
)

echo.
echo Port 3000 libere!
echo.
pause
