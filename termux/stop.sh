#!/data/data/com.termux/files/usr/bin/bash
# PTStorms - Stop Background Server

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$APP_DIR/termux/.ptstorms.pid"

if [ ! -f "$PID_FILE" ]; then
    echo -e "${YELLOW}PTStorms não está a correr em background${NC}"
    exit 0
fi

PID=$(cat "$PID_FILE")

if kill -0 "$PID" 2>/dev/null; then
    echo -e "${YELLOW}A parar PTStorms (PID: $PID)...${NC}"
    kill "$PID"
    rm -f "$PID_FILE"
    echo -e "${GREEN}PTStorms parado com sucesso!${NC}"
else
    echo -e "${YELLOW}Processo não encontrado, a limpar PID file...${NC}"
    rm -f "$PID_FILE"
fi
