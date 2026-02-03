#!/data/data/com.termux/files/usr/bin/bash
# PTStorms - Start in Background
# Corre o servidor em background

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PORT="${PORT:-8080}"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$APP_DIR/termux/.ptstorms.pid"
LOG_FILE="$APP_DIR/termux/.ptstorms.log"

# Verificar se já está a correr
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
        echo -e "${YELLOW}PTStorms já está a correr (PID: $OLD_PID)${NC}"
        echo -e "${YELLOW}Usa ./stop.sh para parar${NC}"
        exit 1
    else
        rm -f "$PID_FILE"
    fi
fi

cd "$APP_DIR"

echo -e "${BLUE}A iniciar PTStorms em background...${NC}"

# Iniciar servidor em background
nohup python3 -m http.server $PORT --bind 0.0.0.0 > "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

sleep 1

if [ -f "$PID_FILE" ] && kill -0 "$(cat $PID_FILE)" 2>/dev/null; then
    echo -e "${GREEN}PTStorms iniciado com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}URL:${NC}      http://localhost:$PORT"
    echo -e "${BLUE}PID:${NC}      $(cat $PID_FILE)"
    echo -e "${BLUE}Log:${NC}      $LOG_FILE"
    echo ""
    echo -e "${YELLOW}Para parar: ./termux/stop.sh${NC}"
else
    echo -e "${RED}Erro ao iniciar PTStorms${NC}"
    exit 1
fi
