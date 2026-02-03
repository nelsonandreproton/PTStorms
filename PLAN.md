# PTStorms - Plano de Implementação

## Objetivo
Criar um site com um mapa interativo que mostre tempestades em tempo real em Portugal, com cores para indicar a intensidade.

---

## 1. Fontes de Dados Oficiais Validadas

### 1.1 IPMA (Instituto Português do Mar e da Atmosfera) - OFICIAL
**URL Base:** https://api.ipma.pt/

| Endpoint | Descrição | Formato |
|----------|-----------|---------|
| `/open-data/forecast/warnings/warnings_www.json` | Avisos meteorológicos ativos (tempestades, chuva, vento) | JSON |
| `/open-data/forecast/meteorology/cities/daily/hp-daily-forecast-day{0-2}.json` | Previsão diária por cidade | JSON |
| Lista de localizações | IDs das localidades portuguesas com coordenadas lat/lon | JSON |

**Níveis de Aviso (cores):**
- Verde - Normal
- Amarelo - Atenção
- Laranja - Moderado
- Vermelho - Extremo

**Tipos de Aviso Relevantes:**
- Precipitação intensa
- Trovoadas
- Vento forte
- Nevoeiro

**Atualização:** 2x por dia (00UTC ~10:00, 12UTC ~20:00)

### 1.2 RainViewer API - GRATUITA
**URL:** https://www.rainviewer.com/api.html

| Recurso | Descrição |
|---------|-----------|
| Radar de precipitação | Tiles de mapa com dados de radar |
| Previsão (nowcast) | Até 1 hora no futuro |
| Satélite infravermelhos | Cobertura de nuvens |

**Características:**
- Gratuito para uso pessoal/educacional
- Sem necessidade de API key
- Cobertura: +90 países, +1000 estações radar
- Atualização: A cada 5-10 minutos
- Rate limit: 1000 requests/IP/minuto
- Suporta Leaflet.js nativamente

**Intensidade (cores do radar):**
- Azul claro - Chuviscos
- Azul - Intensidade média
- Amarelo/Vermelho - Precipitação muito forte (trovoadas)

### 1.3 Open-Meteo API - GRATUITA
**URL:** https://open-meteo.com/

| Recurso | Descrição |
|---------|-----------|
| Previsão horária | Temperatura, vento, precipitação, nuvens |
| Dados históricos | 80+ anos de dados |
| Modelos de alta resolução | 1-2 km para Europa |

**Características:**
- Gratuito para uso não-comercial
- Sem API key necessária
- Atualização horária
- JSON fácil de usar

### 1.4 Blitzortung.org - COMUNITÁRIA
**URL:** https://www.blitzortung.org/

| Recurso | Descrição |
|---------|-----------|
| Descargas elétricas | Localização em tempo real de raios |
| WebSocket API | Streaming de dados |

**Características:**
- Dados em tempo real via WebSocket
- Excelente cobertura na Europa/Portugal
- Requer atribuição
- Visualização: https://www.lightningmaps.org/

---

## 2. Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Leaflet.js │  │  Painel de  │  │   Legenda de Cores  │  │
│  │    Mapa     │  │   Avisos    │  │   e Intensidade     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Camadas de Dados                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │  RainViewer  │ │     IPMA     │ │    Blitzortung       │ │
│  │  Radar Tiles │ │    Avisos    │ │  Raios (opcional)    │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Stack Tecnológica Recomendada

### Frontend (Site Estático)
- **HTML5/CSS3/JavaScript** - Sem necessidade de framework complexo
- **Leaflet.js** - Biblioteca de mapas (leve, open-source)
- **OpenStreetMap** - Tiles base do mapa

### Alternativa com Framework
- **React** ou **Vue.js** - Se quiser mais interatividade
- **Vite** - Build tool rápido

---

## 4. Funcionalidades Planeadas

### MVP (Mínimo Viável)
1. **Mapa de Portugal** centrado e com zoom apropriado
2. **Camada de radar** (RainViewer) com precipitação em tempo real
3. **Escala de cores** para intensidade:
   - Sem precipitação (transparente)
   - Leve (azul claro)
   - Moderada (azul/verde)
   - Forte (amarelo)
   - Muito forte (laranja)
   - Extrema (vermelho/roxo)
4. **Avisos IPMA** mostrados como marcadores/polígonos no mapa
5. **Legenda** explicativa das cores
6. **Auto-refresh** a cada 5-10 minutos

### Funcionalidades Adicionais (Futuras)
- Animação temporal (últimas 2 horas)
- Previsão de curto prazo (nowcast)
- Descargas elétricas em tempo real (Blitzortung)
- Notificações de avisos
- Modo escuro
- PWA para mobile

---

## 5. Estrutura de Ficheiros Proposta

```
PTStorms/
├── index.html           # Página principal
├── css/
│   └── styles.css       # Estilos
├── js/
│   ├── app.js           # Aplicação principal
│   ├── map.js           # Configuração do mapa Leaflet
│   ├── radar.js         # Integração RainViewer
│   ├── warnings.js      # Integração IPMA avisos
│   └── legend.js        # Legenda de cores
├── assets/
│   └── icons/           # Ícones de avisos
└── README.md
```

---

## 6. Escala de Cores (dBZ para Intensidade)

| dBZ | Cor | Intensidade | Descrição |
|-----|-----|-------------|-----------|
| 5-20 | #88DDFF | Muito leve | Chuviscos |
| 20-30 | #0088FF | Leve | Chuva leve |
| 30-40 | #00FF00 | Moderada | Chuva moderada |
| 40-50 | #FFFF00 | Forte | Chuva forte |
| 50-60 | #FF8800 | Muito forte | Trovoada |
| 60+ | #FF0000 | Extrema | Tempestade severa |

---

## 7. APIs a Integrar (Prioridade)

### Prioridade 1 (Essencial)
1. **RainViewer** - Radar de precipitação (visual principal)
2. **IPMA Avisos** - Alertas oficiais portugueses

### Prioridade 2 (Melhorias)
3. **Open-Meteo** - Dados meteorológicos complementares
4. **Blitzortung** - Raios em tempo real

---

## 8. Considerações Técnicas

### CORS
- RainViewer: Suporta CORS
- IPMA: Pode necessitar de proxy para alguns endpoints
- Open-Meteo: Suporta CORS

### Performance
- Usar lazy loading para tiles
- Cache de dados de avisos (5 min)
- Debounce em atualizações do mapa

### Responsividade
- Design mobile-first
- Controlos de zoom adaptados a touch

---

## 9. Próximos Passos

1. [ ] Configurar projeto base (HTML/CSS/JS)
2. [ ] Implementar mapa Leaflet centrado em Portugal
3. [ ] Integrar RainViewer para camada de radar
4. [ ] Adicionar legenda de cores
5. [ ] Integrar avisos do IPMA
6. [ ] Adicionar auto-refresh
7. [ ] Estilizar interface
8. [ ] Testar em diferentes dispositivos

---

## Fontes

- [IPMA API](https://api.ipma.pt/)
- [IPMA - Radar](https://www.ipma.pt/en/otempo/obs.radar/)
- [RainViewer API](https://www.rainviewer.com/api.html)
- [RainViewer GitHub Example](https://github.com/rainviewer/rainviewer-api-example)
- [Open-Meteo](https://open-meteo.com)
- [Blitzortung](https://www.blitzortung.org/)
- [Lightningmaps](https://www.lightningmaps.org/)
- [Leaflet.js](https://leafletjs.com/)
