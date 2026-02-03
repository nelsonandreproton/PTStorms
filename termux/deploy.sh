#!/data/data/com.termux/files/usr/bin/bash
# PTStorms - Termux Deployment Script
# Este script serve a aplicação PTStorms localmente no Termux

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
PORT="${PORT:-8080}"
HOST="${HOST:-0.0.0.0}"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}   PTStorms - Termux Deploy    ${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Verificar se estamos no Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo -e "${YELLOW}Aviso: Não parece estar a correr no Termux${NC}"
    echo -e "${YELLOW}O script vai continuar, mas pode ter comportamento diferente${NC}"
    echo ""
fi

# Função para obter IP local
get_local_ip() {
    ip addr show 2>/dev/null | grep -oP 'inet \K[\d.]+' | grep -v '127.0.0.1' | head -1
}

# Função para verificar se porta está em uso
check_port() {
    if command -v lsof &> /dev/null; then
        lsof -i:$PORT &> /dev/null && return 0 || return 1
    elif command -v netstat &> /dev/null; then
        netstat -tuln | grep ":$PORT " &> /dev/null && return 0 || return 1
    else
        return 1
    fi
}

# Verificar se a porta está em uso
if check_port; then
    echo -e "${RED}Erro: Porta $PORT já está em uso${NC}"
    echo -e "${YELLOW}Tenta: PORT=8081 ./deploy.sh${NC}"
    exit 1
fi

# Mudar para o diretório da aplicação
cd "$APP_DIR"

echo -e "${GREEN}Diretório:${NC} $APP_DIR"
echo -e "${GREEN}Porta:${NC} $PORT"
echo ""

# Obter IP local para acesso na rede
LOCAL_IP=$(get_local_ip)

# Tentar diferentes servidores HTTP
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}A usar Python HTTP Server...${NC}"
    echo ""
    echo -e "${BLUE}Acesso local:${NC}    http://localhost:$PORT"
    if [ -n "$LOCAL_IP" ]; then
        echo -e "${BLUE}Acesso na rede:${NC}  http://$LOCAL_IP:$PORT"
    fi
    echo ""
    echo -e "${YELLOW}Pressiona Ctrl+C para parar${NC}"
    echo ""
    python3 -m http.server $PORT --bind $HOST
elif command -v python &> /dev/null; then
    echo -e "${GREEN}A usar Python HTTP Server...${NC}"
    echo ""
    echo -e "${BLUE}Acesso local:${NC}    http://localhost:$PORT"
    if [ -n "$LOCAL_IP" ]; then
        echo -e "${BLUE}Acesso na rede:${NC}  http://$LOCAL_IP:$PORT"
    fi
    echo ""
    echo -e "${YELLOW}Pressiona Ctrl+C para parar${NC}"
    echo ""
    python -m http.server $PORT --bind $HOST
elif command -v node &> /dev/null; then
    # Verificar se http-server ou serve está instalado
    if command -v http-server &> /dev/null; then
        echo -e "${GREEN}A usar http-server (Node.js)...${NC}"
        echo ""
        echo -e "${BLUE}Acesso local:${NC}    http://localhost:$PORT"
        if [ -n "$LOCAL_IP" ]; then
            echo -e "${BLUE}Acesso na rede:${NC}  http://$LOCAL_IP:$PORT"
        fi
        echo ""
        echo -e "${YELLOW}Pressiona Ctrl+C para parar${NC}"
        echo ""
        http-server -p $PORT -a $HOST
    elif command -v serve &> /dev/null; then
        echo -e "${GREEN}A usar serve (Node.js)...${NC}"
        echo ""
        echo -e "${BLUE}Acesso local:${NC}    http://localhost:$PORT"
        if [ -n "$LOCAL_IP" ]; then
            echo -e "${BLUE}Acesso na rede:${NC}  http://$LOCAL_IP:$PORT"
        fi
        echo ""
        echo -e "${YELLOW}Pressiona Ctrl+C para parar${NC}"
        echo ""
        serve -l $PORT
    else
        echo -e "${YELLOW}Node.js encontrado mas sem servidor HTTP instalado${NC}"
        echo -e "${YELLOW}Instala com: npm install -g http-server${NC}"
        exit 1
    fi
elif command -v php &> /dev/null; then
    echo -e "${GREEN}A usar PHP Built-in Server...${NC}"
    echo ""
    echo -e "${BLUE}Acesso local:${NC}    http://localhost:$PORT"
    if [ -n "$LOCAL_IP" ]; then
        echo -e "${BLUE}Acesso na rede:${NC}  http://$LOCAL_IP:$PORT"
    fi
    echo ""
    echo -e "${YELLOW}Pressiona Ctrl+C para parar${NC}"
    echo ""
    php -S $HOST:$PORT
else
    echo -e "${RED}Erro: Nenhum servidor HTTP encontrado${NC}"
    echo ""
    echo -e "${YELLOW}Instala um dos seguintes no Termux:${NC}"
    echo "  pkg install python"
    echo "  pkg install nodejs"
    echo "  pkg install php"
    exit 1
fi
