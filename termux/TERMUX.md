# PTStorms - Deploy no Termux (Android)

Este guia explica como correr o PTStorms localmente no teu telemóvel Android usando o Termux.

## Requisitos

- Android 7.0 ou superior
- [Termux](https://f-droid.org/packages/com.termux/) (instalar via F-Droid, **não** da Play Store)
- Conexão à internet (para os dados de radar e avisos)

## Instalacao Rapida

```bash
# 1. Instalar dependencias
pkg update && pkg install git python

# 2. Clonar repositorio
git clone https://github.com/nelsonandreproton/PTStorms.git
cd PTStorms

# 3. Iniciar servidor
./termux/deploy.sh
```

Abre o browser em: `http://localhost:8080`

## Scripts Disponiveis

| Script | Descricao |
|--------|-----------|
| `./termux/setup.sh` | Configura o ambiente Termux (primeira vez) |
| `./termux/deploy.sh` | Inicia o servidor em primeiro plano |
| `./termux/start-background.sh` | Inicia o servidor em background |
| `./termux/stop.sh` | Para o servidor em background |
| `./termux/status.sh` | Verifica estado do servidor |

## Instalacao Detalhada

### 1. Instalar Termux

Instala o Termux a partir do [F-Droid](https://f-droid.org/packages/com.termux/).

> **Nota:** A versao da Play Store esta desatualizada e pode nao funcionar corretamente.

### 2. Configurar Termux

Abre o Termux e executa:

```bash
# Atualizar pacotes
pkg update && pkg upgrade

# Instalar dependencias
pkg install git python

# Configurar acesso ao armazenamento (opcional)
termux-setup-storage
```

### 3. Clonar o Repositorio

```bash
# Ir para o diretorio home
cd ~

# Clonar o repositorio
git clone https://github.com/nelsonandreproton/PTStorms.git

# Entrar no diretorio
cd PTStorms

# Dar permissoes de execucao aos scripts
chmod +x termux/*.sh
```

### 4. Iniciar o Servidor

**Opcao A - Primeiro Plano (recomendado para debug):**
```bash
./termux/deploy.sh
```

**Opcao B - Background (para uso continuo):**
```bash
./termux/start-background.sh
```

### 5. Aceder a Aplicacao

Abre o browser (Chrome, Firefox, etc.) e vai a:
- **Local:** `http://localhost:8080`
- **Na rede local:** `http://[IP-DO-TELEMOVEL]:8080`

## Comandos Uteis

### Mudar Porta
```bash
PORT=3000 ./termux/deploy.sh
```

### Ver Logs (background)
```bash
cat termux/.ptstorms.log
```

### Verificar Estado
```bash
./termux/status.sh
```

### Parar Servidor
```bash
# Se em primeiro plano: Ctrl+C
# Se em background:
./termux/stop.sh
```

## Acesso a partir de outros dispositivos

Se quiseres aceder ao PTStorms a partir de outros dispositivos na mesma rede Wi-Fi:

1. Obtem o IP do telemovel:
   ```bash
   ip addr show wlan0 | grep inet
   ```

2. Acede a partir do outro dispositivo:
   ```
   http://[IP-DO-TELEMOVEL]:8080
   ```

## Resolucao de Problemas

### "Permission denied"
```bash
chmod +x termux/*.sh
```

### "Address already in use"
```bash
# Usar outra porta
PORT=8081 ./termux/deploy.sh

# Ou parar processo existente
./termux/stop.sh
```

### Nao carrega dados de radar/avisos
- Verifica a conexao a internet
- As APIs externas (RainViewer, IPMA) requerem internet

### Termux fecha em background
Nas definicoes do Android:
1. Vai a Definicoes > Apps > Termux
2. Desativa "Otimizacao de bateria"
3. Ativa "Permitir atividade em segundo plano"

Ou usa:
```bash
termux-wake-lock
./termux/start-background.sh
```

## Atualizacoes

Para atualizar o PTStorms:

```bash
cd ~/PTStorms
git pull origin main
```

## Estrutura dos Ficheiros

```
PTStorms/
├── index.html          # Pagina principal
├── css/
│   └── styles.css      # Estilos
├── js/
│   ├── app.js          # Logica principal
│   ├── config.js       # Configuracao
│   ├── map.js          # Mapa Leaflet
│   ├── radar.js        # Radar RainViewer
│   ├── warnings.js     # Avisos IPMA
│   └── legend.js       # Legenda
└── termux/
    ├── TERMUX.md       # Este ficheiro
    ├── setup.sh        # Setup inicial
    ├── deploy.sh       # Servidor interativo
    ├── start-background.sh  # Servidor background
    ├── stop.sh         # Parar servidor
    └── status.sh       # Ver estado
```
