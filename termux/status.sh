#!/data/data/com.termux/files/usr/bin/bash
# PTStorms - Check Status

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$APP_DIR/termux/.ptstorms.pid"
PORT="${PORT:-8080}"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}   PTStorms - Status           ${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Verificar PID file
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo -e "${GREEN}Estado:${NC}   A correr"
        echo -e "${GREEN}PID:${NC}      $PID"
        echo -e "${GREEN}URL:${NC}      http://localhost:$PORT"

        # Obter IP local
        LOCAL_IP=$(ip addr show 2>/dev/null | grep -oP 'inet \K[\d.]+' | grep -v '127.0.0.1' | head -1)
        if [ -n "$LOCAL_IP" ]; then
            echo -e "${GREEN}Rede:${NC}     http://$LOCAL_IP:$PORT"
        fi
    else
        echo -e "${RED}Estado:${NC}   Parado (PID stale)"
        rm -f "$PID_FILE"
    fi
else
    # Verificar se há algum servidor na porta
    if command -v lsof &> /dev/null && lsof -i:$PORT &> /dev/null; then
        echo -e "${YELLOW}Estado:${NC}   Algo está a correr na porta $PORT (não gerido por este script)"
    else
        echo -e "${RED}Estado:${NC}   Parado"
    fi
fi

echo ""
