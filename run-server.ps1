# FLOOXY'S COMMUNITY - SERVER LAUNCHER (PowerShell)

Clear-Host

Write-Host ""
Write-Host "FLOOXY'S COMMUNITY - SERVER LAUNCHER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR: package.json non trouve!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Assurez-vous d'etre dans le bon dossier:" -ForegroundColor Yellow
    Write-Host "C:\Users\Waxy360\Desktop\site internet" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Dossier actuel: $(Get-Location)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur une touche pour fermer"
    exit 1
}

Write-Host "OK: package.json trouve" -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Installation des dependances..." -ForegroundColor Yellow
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERREUR lors de npm install" -ForegroundColor Red
        Write-Host ""
        Read-Host "Appuyez sur une touche pour fermer"
        exit 1
    }
    Write-Host "OK: Dependances installees" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEMARRAGE DU SERVEUR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "En attente du serveur..." -ForegroundColor Yellow
Write-Host ""

# Start the server and keep window open
& npm start

# If we get here, npm failed
Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "ERREUR AU DEMARRAGE!" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Si tu vois une erreur ci-dessus, copie-la et dis-la moi!" -ForegroundColor Yellow
Write-Host ""
Read-Host "Appuyez sur une touche pour fermer"

exit 1
