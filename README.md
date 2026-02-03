# PTStorms

Mapa interativo de tempestades em tempo real para Portugal.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Funcionalidades

- **Radar de precipitação** - Dados em tempo real do RainViewer
- **Avisos meteorológicos** - Integração com API oficial do IPMA
- **Escala de cores** - Visualização intuitiva da intensidade
- **Animação temporal** - Ver evolução das últimas 2 horas
- **Auto-refresh** - Atualização automática dos dados
- **Responsivo** - Funciona em desktop e mobile

## Screenshot

```
┌─────────────────────────────────────────┐
│  PTStorms     Tempestades em Tempo Real │
├─────────────────────────────────────────┤
│                                         │
│         [Mapa de Portugal]              │
│            com radar de                 │
│           precipitação                  │
│                                         │
│  ┌──────────┐                           │
│  │ Legenda  │                           │
│  │ ■ Leve   │                           │
│  │ ■ Forte  │                           │
│  └──────────┘                           │
└─────────────────────────────────────────┘
```

## Começar

### Opção 1: Abrir diretamente

Basta abrir o ficheiro `index.html` num browser moderno.

### Opção 2: Servidor local

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Depois abre [http://localhost:8000](http://localhost:8000)

## Estrutura do Projeto

```
PTStorms/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos (tema escuro)
├── js/
│   ├── config.js       # Configurações
│   ├── map.js          # Mapa Leaflet
│   ├── radar.js        # Integração RainViewer
│   ├── warnings.js     # Integração IPMA
│   ├── legend.js       # Legenda de cores
│   └── app.js          # Aplicação principal
└── assets/
    └── icons/          # Ícones
```

## Fontes de Dados

| Fonte | Dados | Atualização |
|-------|-------|-------------|
| [RainViewer](https://www.rainviewer.com/) | Radar de precipitação | ~5 min |
| [IPMA](https://api.ipma.pt/) | Avisos meteorológicos | ~10 min |

## Escala de Cores

### Precipitação (dBZ)

| Cor | Intensidade |
|-----|-------------|
| ![#88DDFF](https://via.placeholder.com/15/88DDFF/88DDFF) | Muito leve |
| ![#0088FF](https://via.placeholder.com/15/0088FF/0088FF) | Leve |
| ![#00FF00](https://via.placeholder.com/15/00FF00/00FF00) | Moderada |
| ![#FFFF00](https://via.placeholder.com/15/FFFF00/FFFF00) | Forte |
| ![#FF8800](https://via.placeholder.com/15/FF8800/FF8800) | Muito forte |
| ![#FF0000](https://via.placeholder.com/15/FF0000/FF0000) | Extrema |

### Avisos IPMA

| Cor | Nível |
|-----|-------|
| ![#ECC94B](https://via.placeholder.com/15/ECC94B/ECC94B) | Amarelo - Atenção |
| ![#ED8936](https://via.placeholder.com/15/ED8936/ED8936) | Laranja - Moderado |
| ![#F56565](https://via.placeholder.com/15/F56565/F56565) | Vermelho - Extremo |

## Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `R` | Atualizar dados |
| `P` / `Espaço` | Play/pause animação |
| `L` | Toggle camada de radar |
| `W` | Toggle painel de avisos |

## Tecnologias

- [Leaflet.js](https://leafletjs.com/) - Mapas interativos
- [RainViewer API](https://www.rainviewer.com/api.html) - Dados de radar
- [IPMA API](https://api.ipma.pt/) - Avisos meteorológicos
- [CartoDB](https://carto.com/) - Tiles do mapa base

## Deploy

### GitHub Pages

1. Vai a Settings → Pages
2. Seleciona a branch `main`
3. O site estará em `https://username.github.io/PTStorms`

### Netlify / Vercel

Basta conectar o repositório - deploy automático.

## Licença

MIT License - ver [LICENSE](LICENSE)

## Autor

Desenvolvido para monitorização meteorológica em Portugal.

---

**Nota:** Este projeto usa dados públicos disponibilizados pelo IPMA e RainViewer. Os dados são apenas informativos e não devem ser usados para tomada de decisões críticas.
