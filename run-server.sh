#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      🚀 FLØØXY'S COMMUNITY - SERVER LAUNCHER 🚀           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}📍 Dossier: $(pwd)${NC}"
echo ""
echo "Vérification des fichiers..."

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ ERREUR: package.json non trouvé!${NC}"
    echo "Assurez-vous d'être dans le dossier correct"
    exit 1
fi
echo -e "${GREEN}✅ package.json trouvé${NC}"

if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}📦 Installation des dépendances (première fois)...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erreur lors de npm install${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dépendances installées${NC}"
fi

echo ""
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🎮 Démarrage du serveur...                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}📡 Serveur en cours de démarrage...${NC}"
echo -e "${YELLOW}💻 URL: http://localhost:3000${NC}"
echo -e "${YELLOW}🛑 Pour arrêter: Appuyez sur Ctrl+C${NC}"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

npm start

if [ $? -ne 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo -e "${RED}❌ ERREUR DÉTECTÉE!${NC}"
    echo ""
    echo "Lisez les messages ci-dessus pour plus de détails."
    exit 1
fi
