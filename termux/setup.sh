#!/data/data/com.termux/files/usr/bin/bash
# PTStorms - Termux Setup Script
# Este script configura o ambiente Termux para correr PTStorms

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}   PTStorms - Termux Setup     ${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Verificar se estamos no Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo -e "${RED}Erro: Este script deve ser executado no Termux${NC}"
    exit 1
fi

echo -e "${GREEN}[1/4]${NC} A atualizar pacotes..."
pkg update -y

echo ""
echo -e "${GREEN}[2/4]${NC} A instalar dependências..."
pkg install -y git python

echo ""
echo -e "${GREEN}[3/4]${NC} A configurar permissões de armazenamento..."
if [ ! -d "$HOME/storage" ]; then
    echo -e "${YELLOW}A pedir acesso ao armazenamento...${NC}"
    termux-setup-storage
    sleep 2
fi

echo ""
echo -e "${GREEN}[4/4]${NC} A verificar instalação..."

# Verificar Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    echo -e "  ${GREEN}✓${NC} $PYTHON_VERSION"
else
    echo -e "  ${RED}✗${NC} Python não instalado"
fi

# Verificar Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version 2>&1)
    echo -e "  ${GREEN}✓${NC} $GIT_VERSION"
else
    echo -e "  ${RED}✗${NC} Git não instalado"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}   Setup Completo!             ${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo ""
echo "1. Clone o repositório (se ainda não o fez):"
echo -e "   ${YELLOW}git clone https://github.com/nelsonandreproton/PTStorms.git${NC}"
echo ""
echo "2. Entre no diretório:"
echo -e "   ${YELLOW}cd PTStorms${NC}"
echo ""
echo "3. Execute o servidor:"
echo -e "   ${YELLOW}./termux/deploy.sh${NC}"
echo ""
echo "4. Abra no browser:"
echo -e "   ${YELLOW}http://localhost:8080${NC}"
echo ""
